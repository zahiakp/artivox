import React from 'react';

// Define the styles for each category
const categoryStyles:any = {
  minor: "bg-blue-100 text-blue-800",
  permier: "bg-green-100 text-green-800",
  subjunior: "bg-primary-100 text-primary-800",
  junior: "bg-primary-100 text-primary-800",
  senior: "bg-indigo-100 text-indigo-800",
  default: "bg-gray-100 text-gray-800", // A fallback style
};

const categoryLabels:any = {
  lp: "Lower Primary",
  up: "Upper Primary",
  hs: "High School",
  hss: "Higher Secondary",
  junior: "Junior",
  senior: "Senior",
  general: "General",
  campus: "Campus",
  campusgirls: "Campus Girls",
  campusgeneral: "Campus General",
  campusgirlsparellel: "Campus Girls Parellel",
}

const CategoryDesignProvider = ({ category = 'default'}) => {
  console.log(category);
  // Determine the classes to apply. Fallback to 'default' if the category is not found.
  const appliedClasses = categoryStyles[category] || categoryStyles.default;

  const baseClasses = "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium";

  return (
    <span className={`${baseClasses} ${appliedClasses}`}>
      {categoryLabels[category.toLowerCase()] || category}
    </span>
  );
};

export default CategoryDesignProvider;