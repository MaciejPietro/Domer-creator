// import { Tooltip } from "primereact/tooltip";

import { InfoCircle } from 'tabler-icons-react';

const PasswordRules = () => {
    return (
        <>
            <div className="p-1 text-sm flex gap-1 items-center info-password text-gray-400">
                Zasady hasła
                <InfoCircle className="size-4" />
            </div>
            {/* <Tooltip
        target={`.info-password`}
        className="!rounded-sm text-xs p-0"
        position="top"
      >
        Hasło musi zawierać minimum:
        <ul className="list-disc list-inside mt-1">
          <li>8 znaków</li>
          <li>1 dużą literę</li>
          <li>1 cyfrę</li>
        </ul>
      </Tooltip> */}
        </>
    );
};

export default PasswordRules;
