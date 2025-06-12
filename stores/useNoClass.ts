import { create } from "zustand";

type Store = {
  noClass: boolean;
  setNoClass: (newvalue: boolean) => void;
};

const useNoClass = create<Store>((set) => ({
  noClass: false,
  setNoClass: (newvalue) => set({ noClass: newvalue }),
}));

export default useNoClass;
