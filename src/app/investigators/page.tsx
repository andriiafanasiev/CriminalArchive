'use client';

import React, { useState, useEffect } from 'react';
import { FiSliders } from 'react-icons/fi';

interface Investigator {
    ID_SLIDCHY: number;
    FIO_SLIDCHY: string;
    POSADA_SLIDCHY: string;
    Cases: {
        ID_SPRAVY: number;
        STATUS_SPRAVY: string;
    }[];
}

export default function InvestigatorsPage() {
    const [showForm, setShowForm] = useState(false);
    const [investigators, setInvestigators] = useState<Investigator[]>([]);
    const [form, setForm] = useState({
        fio: '',
        position: '',
    });
    const [errors, setErrors] = useState({
        fio: '',
        position: '',
    });

    useEffect(() => {
        fetchInvestigators();
    }, []);

    const fetchInvestigators = async () => {
        try {
            const response = await fetch('/api/investigators');
            const data = await response.json();

            if (data.error) {
                console.error('API Error:', data.error);
                return;
            }

            if (!Array.isArray(data)) {
                console.error('Invalid data format received');
                return;
            }

            setInvestigators(data);
        } catch (error) {
            console.error('Failed to fetch investigators:', error);
        }
    };

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setErrors({ ...errors, [e.target.name]: '' });
    };

    const validate = () => {
        const newErrors = {
            fio: '',
            position: '',
        };
        if (!form.fio) newErrors.fio = 'ПІБ обовʼязковий';
        if (!form.position) newErrors.position = 'Посада обовʼязкова';
        setErrors(newErrors);
        return !newErrors.fio && !newErrors.position;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (validate()) {
            try {
                const response = await fetch('/api/investigators', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        FIO_SLIDCHY: form.fio,
                        POSADA_SLIDCHY: form.position,
                    }),
                });

                if (response.ok) {
                    await fetchInvestigators();
                    setShowForm(false);
                    setForm({
                        fio: '',
                        position: '',
                    });
                }
            } catch (error) {
                console.error('Failed to create investigator:', error);
            }
        }
    };

    return (
        <div className="flex flex-col items-center min-h-screen py-12">
            <div className="bg-white text-black rounded-3xl shadow-lg px-8 py-10 w-full max-w-4xl relative">
                {showForm ? (
                    <form onSubmit={handleSubmit} className="w-full">
                        <h2 className="text-2xl font-bold mb-8">
                            Додати нового слідчого
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8 items-center mb-8">
                            <label
                                className="text-lg font-normal md:justify-self-end"
                                htmlFor="fio"
                            >
                                ПІБ:
                            </label>
                            <div>
                                <input
                                    id="fio"
                                    name="fio"
                                    type="text"
                                    value={form.fio}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 rounded-full px-6 py-2 text-lg focus:outline-none focus:ring-2 focus:ring-black"
                                />
                                {errors.fio && (
                                    <div className="text-red-500 text-sm mt-1">
                                        {errors.fio}
                                    </div>
                                )}
                            </div>

                            <label
                                className="text-lg font-normal md:justify-self-end"
                                htmlFor="position"
                            >
                                Посада:
                            </label>
                            <div>
                                <input
                                    id="position"
                                    name="position"
                                    type="text"
                                    value={form.position}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 rounded-full px-6 py-2 text-lg focus:outline-none focus:ring-2 focus:ring-black"
                                />
                                {errors.position && (
                                    <div className="text-red-500 text-sm mt-1">
                                        {errors.position}
                                    </div>
                                )}
                            </div>
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-black text-white text-lg rounded-full px-8 py-3 shadow hover:bg-gray-900 transition"
                        >
                            Додати
                        </button>
                    </form>
                ) : (
                    <>
                        <div className="flex justify-center items-center mb-6">
                            <h1 className="text-3xl font-bold text-center flex-1">
                                Слідчі
                            </h1>
                            <button
                                className="absolute right-8 top-0 text-3xl p-2 hover:bg-gray-100 rounded-full transition"
                                aria-label="Фільтрувати"
                            >
                                <FiSliders />
                            </button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="min-w-full text-center">
                                <thead>
                                    <tr className="text-lg font-semibold">
                                        <th className="py-2">ID</th>
                                        <th className="py-2">ПІБ</th>
                                        <th className="py-2">Посада</th>
                                        <th className="py-2">
                                            Кількість справ
                                        </th>
                                        <th className="py-2">Активні справи</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {investigators.map((investigator) => (
                                        <tr
                                            key={investigator.ID_SLIDCHY}
                                            className="text-md"
                                        >
                                            <td className="py-2">
                                                {investigator.ID_SLIDCHY}
                                            </td>
                                            <td className="py-2">
                                                {investigator.FIO_SLIDCHY}
                                            </td>
                                            <td className="py-2">
                                                {investigator.POSADA_SLIDCHY}
                                            </td>
                                            <td className="py-2">
                                                {investigator.Cases.length}
                                            </td>
                                            <td className="py-2">
                                                {
                                                    investigator.Cases.filter(
                                                        (case_) =>
                                                            case_.STATUS_SPRAVY ===
                                                            'активна'
                                                    ).length
                                                }
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="flex justify-center mt-10">
                            <button
                                className="bg-black text-white text-lg rounded-full px-8 py-3 shadow hover:bg-gray-900 transition"
                                onClick={() => setShowForm(true)}
                            >
                                Додати слідчого
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
