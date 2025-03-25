import * as Yup from 'yup';

export const useValidation = () => {
    const validationSchema = Yup.object({
        title: Yup.string()
            .trim("제목을 입력해 주세요")
            .required("제목을 입력해주세요")
            .max(50, "제목은 50자 이내로 입력해주세요"),

        content: Yup.string()
            .trim("내용을 입력해 주세요")
            .required("내용을 입력해주세요")
            .max(2200, "내용은 2200자 이내로 입력해주세요"),

        'region-id': Yup.number()
            .required("지역을 입력해주세요"),

        'talent-g-id': Yup.number()
            .required("줄 재능을 입력해주세요"),

        'talent-t-id': Yup.number()
            .required("받을 재능을 입력해주세요")
    });

    return { validationSchema };
};