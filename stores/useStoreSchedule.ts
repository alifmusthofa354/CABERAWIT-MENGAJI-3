import { create } from "zustand";

type ScheduleType = {
  selectedScheduleName: string | null;
  updateSelectedScheduleName: (newScheduleName: string | null) => void;
};

const useScheduleStore = create<ScheduleType>((set) => ({
  selectedScheduleName: null,
  updateSelectedScheduleName: (newScheduleName) =>
    set({ selectedScheduleName: newScheduleName }),
}));

export default useScheduleStore;
