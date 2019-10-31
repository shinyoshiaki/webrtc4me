import Event from "../../core";
export default function Pack(): {
    event: <T>() => Event<T>;
    finishAll: () => void;
};
