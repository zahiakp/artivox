"use client";

import { AppProgressBar as ProgressBar } from 'next-nprogress-bar';
import { hexColor } from '../../app/data/branding';

const PageLoader = () => {
    return (
<ProgressBar
        height="4.5px"
        color={hexColor||"#f97316"}
        options={{ showSpinner: false }}
        shallowRouting
      />
    );
}

export default PageLoader; 
