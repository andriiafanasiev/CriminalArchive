'use client';

import React, { useState } from 'react';
import { FiSliders } from 'react-icons/fi';

// Тимчасові дані для прикладу, потім заміняться на дані з бекенду
const cases = [
    { id: 1, defendantId: 101, investigatorId: 201, status: 'активна' },
    { id: 2, defendantId: 102, investigatorId: 202, status: 'закрита' },
    { id: 3, defendantId: 103, investigatorId: 203, status: 'очікує розгляду' },
];

const statusOptions = [
    { value: 'активна', label: 'активна' },
    { value: 'закрита', label: 'закрита' },
    { value: 'очікує розгляду', label: 'очікує розгляду' },
];

export default function CasesPage() {
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState({
        id: '',
        defendantId: '',
        investigatorId: '',
        status: statusOptions[0].value,
    });
    const [errors, setErrors] = useState({
        id: '',
        defendantId: '',
        investigatorId: '',
    });

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setErrors({ ...errors, [e.target.name]: '' });
    };

    const validate = () => {
        const newErrors: {
            id: string;
            defendantId: string;
            investigatorId: string;
        } = {
            id: '',
            defendantId: '',
            investigatorId: '',
        };
        if (!form.id) newErrors.id = 'ID Справи обовʼязковий';
        else if (!/^\d+$/.test(form.id)) newErrors.id = 'ID має бути числом';
        if (!form.defendantId)
            newErrors.defendantId = 'ID Засудженого обовʼязковий';
        else if (!/^\d+$/.test(form.defendantId))
            newErrors.defendantId = 'ID має бути числом';
        if (!form.investigatorId)
            newErrors.investigatorId = 'ID Слідчого обовʼязковий';
        else if (!/^\d+$/.test(form.investigatorId))
            newErrors.investigatorId = 'ID має бути числом';
        setErrors(newErrors);
        return (
            !newErrors.id && !newErrors.defendantId && !newErrors.investigatorId
        );
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validate()) {
            // Тут можна відправити дані на бекенд
            setShowForm(false);
            setForm({
                id: '',
                defendantId: '',
                investigatorId: '',
                status: statusOptions[0].value,
            });
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
                                htmlFor="id"
                            >
                                ID Справи:
                            </label>
                            <div>
                                <input
                                    id="id"
                                    name="id"
                                    type="text"
                                    value={form.id}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 rounded-full px-6 py-2 text-lg focus:outline-none focus:ring-2 focus:ring-black"
                                />
                                {errors.id && (
                                    <div className="text-red-500 text-sm mt-1">
                                        {errors.id}
                                    </div>
                                )}
                            </div>

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
                                        <th className="py-2">ID Засудженого</th>
                                        <th className="py-2">ID Слідчого</th>
                                        <th className="py-2">Статус Справи</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {cases.map((item) => (
                                        <tr key={item.id} className="text-md">
                                            <td className="py-2">{item.id}</td>
                                            <td className="py-2">
                                                {item.defendantId}
                                            </td>
                                            <td className="py-2">
                                                {item.investigatorId}
                                            </td>
                                            <td className="py-2">
                                                {item.status}
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
