import React, { PropsWithChildren } from 'react';

import VerticalStackLayout from 'frontend/components/layouts/vertical-stack-layout';

interface FormControlProps {
  error?: string;
  label: string;
}

const FormControl: React.FC<PropsWithChildren<FormControlProps>> = ({
  children,
  error,
  label,
}) => (
  <VerticalStackLayout gap={3}>
    <label className="block min-h-6 font-medium text-black dark:text-white">
      {label}
    </label>

    <div className="relative">{children}</div>

    {error && (
      <div className="flex items-center gap-2 text-xs font-medium tracking-wide text-red-500">
        {/* ONLINE ERROR ICON */}
        <img
          src="https://cdn-icons-png.flaticon.com/512/1828/1828843.png"
          alt="error"
          width={14}
          height={14}
        />
        {error}
      </div>
    )}
  </VerticalStackLayout>
);

export default FormControl;
