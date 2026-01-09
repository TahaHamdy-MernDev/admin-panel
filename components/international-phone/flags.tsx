import { FlagProps } from "react-phone-number-input";
import flags from "react-phone-number-input/flags";

export const FlagComponent = ({ country, countryName }: FlagProps) => {
  const Flag = flags[country];

  return (
    <span className="flex size-6 overflow-hidden [&_svg:not([class*='size-'])]:size-6">
      {Flag && <Flag title={countryName} />}
    </span>
  );
};
