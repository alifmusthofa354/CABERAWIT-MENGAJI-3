"use client";

import { useEffect, useState } from "react";

interface Teacher {
  id: number;
  name: string;
}

interface Class {
  id: number;
  name: string;
  teacher_id: number;
  teachers: Teacher;
}

const ClassList = () => {
  const [classes, setClasses] = useState<Class[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTeacherId, setSelectedTeacherId] = useState<number | null>(
    null
  );

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        // Mendapatkan daftar guru (misalnya dari API)
        const response = await fetch("/api/learning/teacher"); // API untuk mendapatkan daftar guru
        const data = await response.json();
        if (response.ok) {
          setTeachers(data.teachers);
        } else {
          setError("An error occurred while fetching teachers");
        }
      } catch (error) {
        console.log(error);
        setError("An error occurred while fetching teachers");
      }
    };

    fetchTeachers();
  }, []);

  useEffect(() => {
    const fetchClasses = async () => {
      setLoading(true);
      try {
        let url = "/api/learning/classroom";
        if (selectedTeacherId) {
          url += `?teacher_id=${selectedTeacherId}`;
        }
        const response = await fetch(url);
        const data = await response.json();

        if (response.ok) {
          setClasses(data.classes);
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
  }, [selectedTeacherId]);

  if (loading) {
    return <div>Loading classes...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h1>Classes List</h1>

      {/* Dropdown untuk memilih guru */}
      <select
        value={selectedTeacherId || ""}
        onChange={(e) => setSelectedTeacherId(Number(e.target.value))}
      >
        <option value="">Select a Teacher</option>
        {teachers.map((teacher) => (
          <option key={teacher.id} value={teacher.id}>
            {teacher.name}
          </option>
        ))}
      </select>

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
