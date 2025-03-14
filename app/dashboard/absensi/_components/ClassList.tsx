"use client";

import { useEffect, useState } from "react";

interface Teacher {
  name: string;
}

interface Class {
  id: number;
  name: string;
  teacher_id: number;
  teachers: Teacher;
}

const ClassList = ({ teacherId }: { teacherId: number }) => {
  const [classes, setClasses] = useState<Class[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        // Menambahkan query parameter teacher_id
        const response = await fetch(
          `/api/learning/classroom?teacher_id=${teacherId}`
        );
        const data = await response.json();

        if (response.ok) {
          setClasses(data.classes); // Menyimpan data kelas yang sudah difilter
        } else {
          setError(data.error || "An error occurred");
        }
      } catch (error) {
        console.log(error);
        setError("An error occurred while fetching classes");
      } finally {
        setLoading(false);
      }
    };

    fetchClasses();
  }, [teacherId]); // Efek dijalankan saat teacherId berubah

  if (loading) {
    return <div>Loading classes...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h1>Classes List</h1>
      <ul>
        {classes.map((cls) => (
          <li key={cls.id}>
            <strong>{cls.name}</strong> - Teacher: {cls.teachers.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ClassList;
