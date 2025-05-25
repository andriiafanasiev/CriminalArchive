'use client';

import React, { useState, useEffect } from 'react';
import { FiSliders } from 'react-icons/fi';
import Loader from '../components/Loader';

interface Article {
    ID_STATYA: number;
    NUMBER_STATYA: string;
    DESCRIPTION_STATYA: string | null;
}

export default function ArticlesPage() {
    const [showForm, setShowForm] = useState(false);
    const [articles, setArticles] = useState<Article[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [form, setForm] = useState({
        number: '',
        description: '',
    });
    const [errors, setErrors] = useState({
        number: '',
    });

    useEffect(() => {
        fetchArticles();
    }, []);

    const fetchArticles = async () => {
        try {
            setIsLoading(true);
            const response = await fetch('/api/articles');
            const data = await response.json();

            if (data.error) {
                console.error('API Error:', data.error);
                return;
            }

            if (!Array.isArray(data)) {
                console.error('Invalid data format received');
                return;
            }

            setArticles(data);
        } catch (error) {
            console.error('Failed to fetch articles:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setErrors({ ...errors, [e.target.name]: '' });
    };

    const validate = () => {
        const newErrors = {
            number: '',
        };
        if (!form.number) newErrors.number = 'Номер статті обовʼязковий';
        setErrors(newErrors);
        return !newErrors.number;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (validate()) {
            try {
                const response = await fetch('/api/articles', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        NUMBER_STATYA: form.number,
                        DESCRIPTION_STATYA: form.description || null,
                    }),
                });

                if (response.ok) {
                    await fetchArticles();
                    setShowForm(false);
                    setForm({
                        number: '',
                        description: '',
                    });
                }
            } catch (error) {
                console.error('Failed to create article:', error);
            }
        }
    };

    return (
        <div className="flex flex-col items-center min-h-screen py-12">
            <div className="bg-white text-black rounded-3xl shadow-lg px-8 py-10 w-full max-w-4xl relative">
                {showForm ? (
                    <form onSubmit={handleSubmit} className="w-full">
                        <h2 className="text-2xl font-bold mb-8">
                            Додати нову статтю
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8 items-center mb-8">
                            <label
                                className="text-lg font-normal md:justify-self-end"
                                htmlFor="number"
                            >
                                Номер статті:
                            </label>
                            <div>
                                <input
                                    id="number"
                                    name="number"
                                    type="text"
                                    value={form.number}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 rounded-full px-6 py-2 text-lg focus:outline-none focus:ring-2 focus:ring-black"
                                />
                                {errors.number && (
                                    <div className="text-red-500 text-sm mt-1">
                                        {errors.number}
                                    </div>
                                )}
                            </div>

                            <label
                                className="text-lg font-normal md:justify-self-end"
                                htmlFor="description"
                            >
                                Опис:
                            </label>
                            <div>
                                <textarea
                                    id="description"
                                    name="description"
                                    value={form.description}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 rounded-2xl px-6 py-2 text-lg focus:outline-none focus:ring-2 focus:ring-black min-h-[100px]"
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
                                Статті
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
                                                <th className="py-2">
                                                    Номер статті
                                                </th>
                                                <th className="py-2">Опис</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {articles.map((article) => (
                                                <tr
                                                    key={article.ID_STATYA}
                                                    className="text-md"
                                                >
                                                    <td className="py-2">
                                                        {article.ID_STATYA}
                                                    </td>
                                                    <td className="py-2">
                                                        {article.NUMBER_STATYA}
                                                    </td>
                                                    <td className="py-2">
                                                        {article.DESCRIPTION_STATYA ||
                                                            'Не вказано'}
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
                                        Додати статтю
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
