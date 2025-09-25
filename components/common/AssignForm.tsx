"use client";
import React, { useEffect, useState, useCallback } from "react";
import Modal from "./Modal";
import * as Yup from "yup";
import { useCookies } from "react-cookie";
import { useFormik } from "formik";
import { useRouter } from "next/navigation";
import { Select, Spin } from "antd";
import {
  addParticipant,
  editParticipant,
} from "../../app/programs/func";
import { showMessage } from "./CusToast";
import { debounce } from "lodash";
import { getStudentsByteamId, getStudentsByteamIdwithCat } from "../../app/students/func";

const getInitialParticipants = (assign: any, reassign: boolean) => {
  const out: any[] = [];
  const groupSize = Math.max(0, Number(assign?.members ?? 0));
  const maxSlots = Math.max(0, Number(assign?.limit ?? 0));

  if (reassign && assign?.participants?.length) {
    if (assign.isGroup > 0) {
      for (const p of assign.participants) {
        let group: any[] = [];

        if (Array.isArray(p.students) && p.students.length > 0) {
          // ✅ Normal group structure
          group = p.students.map((s: any) => ({
            jamiaNo: s.jamiaNo,
            name: s.name,
            id: p.id,
          }));
        } else {
          // ⚠️ API returned individual-like structure for a group program
          group = [{
            jamiaNo: p.jamiaNo,
            name: p.studentName,
            id: p.id,
          }];
        }

        // Normalize group size
        if (group.length < groupSize) {
          group.push(...Array(groupSize - group.length).fill(null));
        } else if (group.length > groupSize) {
          group.length = groupSize;
        }

        out.push(group);
      }
    } else {
      // Individual program
      for (const par of assign.participants) {
        out.push({
          jamiaNo: par.jamiaNo,
          name: par.studentName,
          id: par.id,
        });
      }
    }
  }

  // Fill empty slots
  while (out.length < maxSlots) {
    out.push(assign.isGroup > 0 ? Array(groupSize).fill(null) : null);
  }

  if (out.length > maxSlots) out.length = maxSlots;

  return out;
};



function AssignForm({
  close,
  assign,
  reassign,
  fetchPrograms,
}: {
  close: any;
  assign: any;
  reassign: any;
  fetchPrograms: any;
}) {
  const [cookies] = useCookies(["access", `${assign.category}`]);
  const { role } = cookies.access;
  const router = useRouter();
  const campus = cookies.access?.campusId;

  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [search, setSearch] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);

  const fetchStudents = useCallback(
    async (keyword: string, pageNo: number) => {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams({
          page: pageNo.toString(),
          limit: "20",
          search: keyword,
        }).toString();
        let res;
        
        if(assign.category == "general"){
          res = await getStudentsByteamId(campus, queryParams,);
        } else {
          res = await getStudentsByteamIdwithCat(campus, queryParams, assign.category);
        }
        
        if (res?.data) {
          
          setStudents((prevStudents) =>
            pageNo === 1 ? res.data : [...prevStudents, ...res.data]
          );
          setHasMore(res.data.length > 0);
        } else {
          setHasMore(false);
        }
      } catch (error) {
        console.error("Error fetching students:", error);
      } finally {
        setLoading(false);
      }
    },
    [campus, assign.category, role]
  );

  const debouncedFetchStudents = useCallback(debounce(fetchStudents, 500), [fetchStudents]);

  useEffect(() => {
    setPage(1);
    setStudents([]);
    debouncedFetchStudents(search, 1);
  }, [search, debouncedFetchStudents]);

  const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
    const target = event.currentTarget;
    if (target.scrollHeight - target.scrollTop - target.clientHeight < 10 && !loading && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchStudents(search, nextPage);
    }
  };
  
  const getEndpointByRole = (role: any) => {
    switch (role) {
      case "campus": return "participants";
      default: return "";
    }
  };

  const validationSchema = Yup.object().shape({});

  const formik = useFormik({
    initialValues: {
      participants: getInitialParticipants(assign, reassign),
      program: assign.id,
      campus: cookies.access?.username
    },
    onSubmit: async (values: any) => {
      setSubmitLoading(true);
      try {
        const endpoint = getEndpointByRole(role);
        let success = true;

        if (assign.isGroup > 0) {
          for (const group of values.participants) {
            const validMembers = group.filter((member: any) => member && member.jamiaNo);
            if (validMembers.length === 0) continue;

            const groupJamiaNos = validMembers.map((member: any) => member.jamiaNo).join(",");
            const existingParticipant = validMembers.find((member: any) => member.id);
            const participantId = existingParticipant ? existingParticipant.id : null;
            
            const resp = participantId
              ? await editParticipant(participantId, { ...values, participants: [group] }, groupJamiaNos, endpoint)
              : await addParticipant({ ...values, participants: [group] }, groupJamiaNos, endpoint);
            
            if (!resp) {
              success = false;
              break;
            }
          }
        } else {
          for (const par of values.participants) {
            if (!par || !par.jamiaNo) continue;

            const resp = par.id
              ? await editParticipant(par.id, { ...values, participants: [par] }, par.jamiaNo, endpoint)
              : await addParticipant({ ...values, participants: [par] }, par.jamiaNo, endpoint);
            
            if (!resp) {
              success = false;
              break;
            }
          }
        }

        if (success) {
          showMessage("Participants assigned successfully", "success");
          setTimeout(() => {
            fetchPrograms();
            // router.refresh();
            close(false);
          }, 1000);
        } else {
          showMessage("Failed to assign one or more participants", "error");
        }
      } catch (error: any) {
        showMessage("An error occurred. Please try again later.", "error");
        console.error("Error:", error.message);
      } finally {
        setSubmitLoading(false);
      }
    },
    validationSchema: validationSchema,
  });

  return (
    <Modal close={close} edit={reassign}>
      <form
        className="flex flex-col gap-3 md:w-80"
        onSubmit={formik.handleSubmit}
      >
        <h6 className="font-bold text-xl mb-3 w-full text-center">
          {assign.name}
        </h6>

        {formik.values.participants.map((groupOrMember: any, groupIndex: number) => (
          assign.isGroup > 0 ? (
            <div className="flex flex-col gap-3" key={groupIndex}>
              <h5 className="font-semibold mt-2">Group {groupIndex + 1}</h5>
              <div>
                {groupOrMember.map((member: any, memberIndex: number) => (
                  <Select
                    key={memberIndex}
                    className="w-full my-2"
                    showSearch
                    placeholder={`Select member ${memberIndex + 1}`}
                    size="large"
                    labelInValue
                    allowClear
                    onSearch={setSearch}
                    onPopupScroll={handleScroll}
                    notFoundContent={loading ? <Spin size="small" /> : null}
                    filterOption={false}
                    value={member ? { value: member.jamiaNo, label: member.name } : null}
                    onChange={(selected: any) => {
                      const updatedParticipants = [...formik.values.participants];
                      if (selected) {
                        updatedParticipants[groupIndex][memberIndex] = {
                          jamiaNo: selected.value,
                          name: selected.label,
                          id: member?.id
                        };
                      } else {
                        updatedParticipants[groupIndex][memberIndex] = null;
                      }
                      formik.setFieldValue("participants", updatedParticipants);
                      setSearch(""); // ✅ Clear search on selection
                    }}
                    options={students
                      .filter((std: any) => 
                          !formik.values.participants.flat().some((p: any) => p?.jamiaNo === std.jamiaNo)
                      )
                      .map((std: any) => ({
                        value: std.jamiaNo,
                        label: `${std.name} (${std.jamiaNo})`,
                      }))
                    }
                  />
                ))}
              </div>
            </div>
          ) : (
            <Select
              key={groupIndex}
              className="w-full my-2"
              showSearch
              placeholder={`Select participant ${groupIndex + 1}`}
              size="large"
              labelInValue
              allowClear
              onSearch={setSearch}
              onPopupScroll={handleScroll}
              notFoundContent={loading ? <Spin size="small" /> : null}
              filterOption={false}
              value={groupOrMember ? { value: groupOrMember.jamiaNo, label: groupOrMember.name } : null}
              onChange={(selected: any) => {
                const updatedParticipants = [...formik.values.participants];
                if (selected) {
                  updatedParticipants[groupIndex] = {
                    jamiaNo: selected.value,
                    name: selected.label,
                    id: groupOrMember?.id,
                  };
                } else {
                  updatedParticipants[groupIndex] = null;
                }
                formik.setFieldValue("participants", updatedParticipants);
                setSearch(""); // ✅ Clear search on selection
              }}
              options={students
                .filter((std: any) =>
                  !formik.values.participants.some((p: any) => p?.jamiaNo === std.jamiaNo)
                )
                .map((std: any) => ({
                  value: std.jamiaNo,
                  label: `${std.name} (${std.jamiaNo})`,
                }))
              }
            />
          )
        ))}

        <button
          type="submit"
          className="bg-gradient-to-r from-primary-400 to-primary-600 text-white p-3 rounded-xl mt-3 font-semibold flex justify-center items-center disabled:opacity-50"
          disabled={submitLoading}
        >
          {submitLoading
            ? "Processing..."
            : reassign
            ? "Re-assign Participants"
            : "Assign Participants"}
        </button>
      </form>
    </Modal>
  );
}

export default AssignForm;