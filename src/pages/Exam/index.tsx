import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Question } from "../Edit";
import { answerAdd, examFind } from "../../interfaces";
import { Button, Checkbox, Input, message, Radio } from "antd";

export function Exam() {

    let { id } = useParams();
    const [json, setJson] = useState<Array<Question>>([])
    const [answers, setAnswers] = useState<Array<{ id: number, answer: string }>>([]);

    async function query() {
        if (!id) {
            return;
        }
        try {
            const res = await examFind(+id);
            if (res.status === 201 || res.status === 200) {
                try {
                    const content = JSON.parse(res.data.content);
                    setJson(content)
                    setAnswers(content.map((item: { id: number }) => {
                        return {
                            id: item.id
                        }
                    }));
                } catch (e) { }
            }
        } catch (e: any) {
            message.error(e.response?.data?.message || '系统繁忙，请稍后再试');
        }
    }

    useEffect(() => {
        query();
    }, [])


    function setAnswer(id: number, value: string) {
        setAnswers(answers.map(item => {
            return item.id === id ? {
                id,
                answer: value
            } : item
        }))
    }

    const navigate = useNavigate();

    const addAnswer = useCallback(async function () {
        if (!id) {
            return;
        }
        try {
            const res = await answerAdd({
                examId: +id,
                content: JSON.stringify(answers)
            });

            if (res.status === 201 || res.status === 200) {
                try {
                    message.success('提交成功');

                    navigate('/res/' + res.data.id);
                } catch (e) { }
            }
        } catch (e: any) {
            message.error(e.response?.data?.message || '系统繁忙，请稍后再试');
        }
    }, [answers]);

    function renderComponents(arr: Array<Question>) {
        return arr.map((item, index) => {
            let formComponent;
            if (item.type === 'radio') {
                formComponent = <Radio.Group onChange={(e) => {
                    setAnswer(item.id, e.target.value)
                }}>
                    {
                        item.options?.map(option => <Radio key={option} value={option}>{option}</Radio>)
                    }
                </Radio.Group>
            } else if (item.type === 'checkbox') {
                formComponent = <Checkbox.Group options={item.options} onChange={(values) => {
                    setAnswer(item.id, values.join(','))
                }} />
            } else if (item.type === 'input') {
                formComponent = <Input onChange={(e) => {
                    setAnswer(item.id, e.target.value)
                }} />
            }

            return <div key={item.id} className="mb-6 border border-gray-300 p-4 bg-pink-100 rounded-sm">
                <p className="text-lg">{index + 1}. {item.question}</p>
                <div className="mt-2">
                    {formComponent}
                </div>
            </div>
        })
    }

    return <div className="w-[800px] mx-auto bg-blue-100 px-8 py-6 rounded-md">
        {renderComponents(json)}
        <Button type="primary" className="mt-4 w-full h-[40px]" onClick={() => {
            addAnswer();
        }}>提交</Button>
    </div>
}
