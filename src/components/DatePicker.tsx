import RNDatePicker from "@react-native-community/datetimepicker";
import { createElement, createRef } from "react";
import { Platform } from "react-native";

import { formatDateToISOString } from "~/shared/utils/date";

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
      value={props.date}
      onChange={({ nativeEvent: { timestamp } }) =>
        props.onConfirm?.(timestamp ? new Date(timestamp) : new Date())
      }
    />
  );
};

export default DatePicker;
