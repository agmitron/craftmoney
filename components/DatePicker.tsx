import { createElement, createRef } from "react";
import { Platform } from "react-native";
import RNDatePicker from "react-native-date-picker";

import { formatDateToISOString } from "~/utils/date";

interface Props {
  isOpen: boolean;
  date: Date;
  onConfirm?: (date: Date) => void;
  onCancel?: () => void;
}

const DatePicker: React.FC<Props> = (props) => {
  if (Platform.OS === "web") {
    const ref = createRef<HTMLInputElement>();

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const date = new Date(e.target.value);
      props.onConfirm?.(date);
    };

    const onBlur = () => {
      props.onCancel?.();
    };

    return createElement("input", {
      type: "datetime-local",
      onChange,
      onBlur,
      value: formatDateToISOString(props.date),
      ref,
    });
  }

  return (
    <RNDatePicker
      open={props.isOpen}
      date={props.date}
      onConfirm={props.onConfirm}
      onCancel={props.onCancel}
    />
  );
};

export default DatePicker;
