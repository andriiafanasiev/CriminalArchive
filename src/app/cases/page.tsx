'use client';

import React, { useState, useEffect } from 'react';
import { FiSliders } from 'react-icons/fi';

// Тимчасові дані для прикладу, потім заміняться на дані з бекенду
const statusOptions = [
    { value: 'активна', label: 'активна' },
    { value: 'закрита', label: 'закрита' },
    { value: 'очікує розгляду', label: 'очікує розгляду' },
];

interface Case {
    ID_SPRAVY: number;
    ID_ZASUDZ: number | null;
    ID_SLIDCHY: number | null;
    STATUS_SPRAVY: string;
    convict: {
        FIO_ZASUDZ: string;
    } | null;
    investigator: {
        FIO_SLIDCHY: string;
    } | null;
    CaseLinks: {
        ID_SPRAVY: number;
        ID_STATYA: number;
        DATE_SPRAVY: string;
        article: {
            ID_STATYA: number;
            NUMBER_STATYA: string;
            DESCRIPTION_STATYA: string | null;
        };
    }[];
}

export default function CasesPage() {
    const [showForm, setShowForm] = useState(false);
    const [cases, setCases] = useState<Case[]>([]);
    const [form, setForm] = useState({
        defendantId: '',
        investigatorId: '',
        status: statusOptions[0].value,
    });
    const [errors, setErrors] = useState({
        defendantId: '',
        investigatorId: '',
    });

    useEffect(() => {
        fetchCases();
    }, []);

    const fetchCases = async () => {
        try {
            const response = await fetch('/api/cases');
            const data = await response.json();

            if (data.error) {
                console.error('API Error:', data.error);
                return;
            }

            if (!Array.isArray(data)) {
                console.error('Invalid data format received');
                return;
            }

            setCases(data);
        } catch (error) {
            console.error('Failed to fetch cases:', error);
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
            defendantId: '',
            investigatorId: '',
        };
        if (!form.defendantId)
            newErrors.defendantId = 'ID Засудженого обовʼязковий';
        else if (!/^\d+$/.test(form.defendantId))
            newErrors.defendantId = 'ID має бути числом';
        if (!form.investigatorId)
            newErrors.investigatorId = 'ID Слідчого обовʼязковий';
        else if (!/^\d+$/.test(form.investigatorId))
            newErrors.investigatorId = 'ID має бути числом';
        setErrors(newErrors);
        return !newErrors.defendantId && !newErrors.investigatorId;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (validate()) {
            try {
                const response = await fetch('/api/cases', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        ID_ZASUDZ: form.defendantId,
                        ID_SLIDCHY: form.investigatorId,
                        STATUS_SPRAVY: form.status,
                    }),
                });

                if (response.ok) {
                    await fetchCases();
                    setShowForm(false);
                    setForm({
                        defendantId: '',
                        investigatorId: '',
                        status: statusOptions[0].value,
                    });
                }
            } catch (error) {
                console.error('Failed to create case:', error);
            }
        }
    };

    return (
        <div className="flex flex-col items-center min-h-screen py-12">
            <div className="bg-white text-black rounded-3xl shadow-lg px-8 py-10 w-full max-w-4xl relative">
                {showForm ? (
                    <form onSubmit={handleSubmit} className="w-full">
                        <h2 className="text-2xl font-bold mb-8">
                            Додати нову справу
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8 items-center mb-8">
                            <label
                                className="text-lg font-normal md:justify-self-end"
                                htmlFor="defendantId"
                            >
                                ID Засудженого:
                            </label>
                            <div>
                                <input
                                    id="defendantId"
                                    name="defendantId"
                                    type="text"
                                    value={form.defendantId}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 rounded-full px-6 py-2 text-lg focus:outline-none focus:ring-2 focus:ring-black"
                                />
                                {errors.defendantId && (
                                    <div className="text-red-500 text-sm mt-1">
                                        {errors.defendantId}
                                    </div>
                                )}
                            </div>

                            <label
                                className="text-lg font-normal md:justify-self-end"
                                htmlFor="investigatorId"
                            >
                                ID Слідчого:
                            </label>
                            <div>
                                <input
                                    id="investigatorId"
                                    name="investigatorId"
                                    type="text"
                                    value={form.investigatorId}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 rounded-full px-6 py-2 text-lg focus:outline-none focus:ring-2 focus:ring-black"
                                />
                                {errors.investigatorId && (
                                    <div className="text-red-500 text-sm mt-1">
                                        {errors.investigatorId}
                                    </div>
                                )}
                            </div>

                            <label
                                className="text-lg font-normal md:justify-self-end"
                                htmlFor="status"
                            >
                                Статус Справи:
                            </label>
                            <div>
                                <select
                                    id="status"
                                    name="status"
                                    value={form.status}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 rounded-full px-6 py-2 text-lg focus:outline-none focus:ring-2 focus:ring-black"
                                >
                                    {statusOptions.map((opt) => (
                                        <option
                                            key={opt.value}
                                            value={opt.value}
                                        >
                                            {opt.label}
                                        </option>
                                    ))}
                                </select>
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
                                Справи
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
                                        <th className="py-2">ID Справи</th>
                                        <th className="py-2">Засуджений</th>
                                        <th className="py-2">Слідчий</th>
                                        <th className="py-2">Статус Справи</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {cases.map((item) => (
                                        <tr
                                            key={item.ID_SPRAVY}
                                            className="text-md"
                                        >
                                            <td className="py-2">
                                                {item.ID_SPRAVY}
                                            </td>
                                            <td className="py-2">
                                                {item.convict?.FIO_ZASUDZ ||
                                                    'Не вказано'}
                                            </td>
                                            <td className="py-2">
                                                {item.investigator
                                                    ?.FIO_SLIDCHY ||
                                                    'Не вказано'}
                                            </td>
                                            <td className="py-2">
                                                {item.STATUS_SPRAVY}
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
                                Додати справу
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
