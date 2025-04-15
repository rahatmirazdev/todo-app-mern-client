import { useState, useCallback } from 'react';

export function useForm(initialValues) {
    const [formData, setFormData] = useState(initialValues);

    const handleChange = useCallback((e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({ ...prevData, [name]: value }));
    }, []);

    const resetForm = useCallback(() => {
        setFormData(initialValues);
    }, [initialValues]);

    return { formData, handleChange, setFormData, resetForm };
}
