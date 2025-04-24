import useStore from "@/stores/useStore";

export default function CountStore() {
  const { count, increment } = useStore();
  return (
    <>
      <button
        className="bg-blue-500 text-white px-4 py-2 mr-2"
        onClick={increment}
      >
        {count}
      </button>
    </>
  );
}
