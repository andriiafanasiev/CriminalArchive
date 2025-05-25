'use client';

import React, { useState, useEffect } from 'react';
import { FiSliders } from 'react-icons/fi';
import Loader from '../components/Loader';

interface Convict {
    ID_ZASUDZ: number;
    FIO_ZASUDZ: string;
    DATE_NARODZH: string | null;
    ADRESS_ZASUDZ: string;
    CONTACT_ZASUDZ: string | null;
    Cases: {
        ID_SPRAVY: number;
        STATUS_SPRAVY: string;
        CaseLinks: {
            ID_STATYA: number;
            DATE_SPRAVY: string;
        }[];
    }[];
}

export default function DefendantsPage() {
    const [showForm, setShowForm] = useState(false);
    const [convicts, setConvicts] = useState<Convict[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [form, setForm] = useState({
        fio: '',
        date: '',
        address: '',
        contact: '',
    });
    const [errors, setErrors] = useState({
        fio: '',
        date: '',
        address: '',
        contact: '',
    });

    useEffect(() => {
        fetchConvicts();
    }, []);

    const fetchConvicts = async () => {
        try {
            setIsLoading(true);
            const response = await fetch('/api/defendants');
            const data = await response.json();

            if (data.error) {
                console.error('API Error:', data.error);
                return;
            }

            if (!Array.isArray(data)) {
                console.error('Invalid data format received');
                return;
            }

            setConvicts(data);
        } catch (error) {
            console.error('Failed to fetch convicts:', error);
        } finally {
            setIsLoading(false);
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
            date: '',
            address: '',
            contact: '',
        };
        if (!form.fio) newErrors.fio = 'ПІБ обовʼязковий';
        if (!form.address) newErrors.address = 'Адреса обовʼязкова';
        setErrors(newErrors);
        return !newErrors.fio && !newErrors.address;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (validate()) {
            try {
                const response = await fetch('/api/defendants', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        FIO_ZASUDZ: form.fio,
                        DATE_NARODZH: form.date || null,
                        ADRESS_ZASUDZ: form.address,
                        CONTACT_ZASUDZ: form.contact || null,
                    }),
                });

                if (response.ok) {
                    await fetchConvicts();
                    setShowForm(false);
                    setForm({
                        fio: '',
                        date: '',
                        address: '',
                        contact: '',
                    });
                }
            } catch (error) {
                console.error('Failed to create convict:', error);
            }
        }
    };

    return (
        <div className="flex flex-col items-center min-h-screen py-12">
            <div className="bg-white text-black rounded-3xl shadow-lg px-8 py-10 w-full max-w-4xl relative">
                {showForm ? (
                    <form onSubmit={handleSubmit} className="w-full">
                        <h2 className="text-2xl font-bold mb-8">
                            Додати нового засудженого
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
                                htmlFor="date"
                            >
                                Дата народження:
                            </label>
                            <div>
                                <input
                                    id="date"
                                    name="date"
                                    type="date"
                                    value={form.date}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 rounded-full px-6 py-2 text-lg focus:outline-none focus:ring-2 focus:ring-black"
                                />
                            </div>

                            <label
                                className="text-lg font-normal md:justify-self-end"
                                htmlFor="address"
                            >
                                Адреса:
                            </label>
                            <div>
                                <input
                                    id="address"
                                    name="address"
                                    type="text"
                                    value={form.address}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 rounded-full px-6 py-2 text-lg focus:outline-none focus:ring-2 focus:ring-black"
                                />
                                {errors.address && (
                                    <div className="text-red-500 text-sm mt-1">
                                        {errors.address}
                                    </div>
                                )}
                            </div>

                            <label
                                className="text-lg font-normal md:justify-self-end"
                                htmlFor="contact"
                            >
                                Контакт:
                            </label>
                            <div>
                                <input
                                    id="contact"
                                    name="contact"
                                    type="text"
                                    value={form.contact}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 rounded-full px-6 py-2 text-lg focus:outline-none focus:ring-2 focus:ring-black"
                                />
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
                                Засуджені
                            </h1>
                            <button
                                className="absolute right-8 top-0 text-3xl p-2 hover:bg-gray-100 rounded-full transition"
                                aria-label="Фільтрувати"
                            >
                                <FiSliders />
                            </button>
                        </div>
                        {isLoading ? (
                            <div className="flex justify-center items-center py-20">
                                <Loader />
                            </div>
                        ) : (
                            <>
                                <div className="overflow-x-auto">
                                    <table className="min-w-full text-center">
                                        <thead>
                                            <tr className="text-lg font-semibold">
                                                <th className="py-2">ID</th>
                                                <th className="py-2">ПІБ</th>
                                                <th className="py-2">
                                                    Дата народження
                                                </th>
                                                <th className="py-2">Адреса</th>
                                                <th className="py-2">
                                                    Контакт
                                                </th>
                                                <th className="py-2">
                                                    Кількість справ
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {convicts.map((convict) => (
                                                <tr
                                                    key={convict.ID_ZASUDZ}
                                                    className="text-md"
                                                >
                                                    <td className="py-2">
                                                        {convict.ID_ZASUDZ}
                                                    </td>
                                                    <td className="py-2">
                                                        {convict.FIO_ZASUDZ}
                                                    </td>
                                                    <td className="py-2">
                                                        {convict.DATE_NARODZH
                                                            ? new Date(
                                                                  convict.DATE_NARODZH
                                                              ).toLocaleDateString()
                                                            : 'Не вказано'}
                                                    </td>
                                                    <td className="py-2">
                                                        {convict.ADRESS_ZASUDZ}
                                                    </td>
                                                    <td className="py-2">
                                                        {convict.CONTACT_ZASUDZ ||
                                                            'Не вказано'}
                                                    </td>
                                                    <td className="py-2">
                                                        {convict.Cases.length}
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
                                        Додати засудженого
                                    </button>
                                </div>
                            </>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
