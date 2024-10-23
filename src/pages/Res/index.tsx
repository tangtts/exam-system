import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { answerFind, examFind } from "../../interfaces";
import { Button, Checkbox, Input, message, Radio, Space } from "antd";
import { Question } from "../Edit";

export function Res() {

    let { id } = useParams();

    const [score, setScore] = useState();
    const [json, setJson] = useState<Question[]>([]);

    async function query() {
        if (!id) {
            return;
        }
        try {
            const res = await answerFind(+id);

            if (res.status === 201 || res.status === 200) {
                setScore(res.data.score);

                await queryExam(res.data.examId)
            }
        } catch (e: any) {
            message.error(e.response?.data?.message || '系统繁忙，请稍后再试');
        }
    }

    async function queryExam(examId: number) {
        try {
            const res = await examFind(+examId);

            if (res.status === 201 || res.status === 200) {
                try {
                    const questions = JSON.parse(res.data.content);

                    setJson(questions);
                } catch (e) { }
            }
        } catch (e: any) {
            message.error(e.response?.data?.message || '系统繁忙，请稍后再试');
        }
    }

    useEffect(() => {
        query();
    }, [])

    function renderComponents(arr: Array<Question>) {
        return arr.map(item => {
            let formComponent;
            if (item.type === 'radio') {
                formComponent = <Radio.Group value={item.answer}>
                    {
                        item.options?.map(option => <Radio key={option} value={option}>{option}</Radio>)
                    }
                </Radio.Group>
            } else if (item.type === 'checkbox') {
                formComponent = <Checkbox.Group options={item.options} value={item.answer.split(',')} />
            } else if (item.type === 'input') {
                formComponent = <Input value={item.answer} />
            }

            return <div className="flex flex-col gap-3 bg-pink-100 rounded-md p-4" key={item.id}>
                <p className="question">{item.question}</p>
                <div className="options">
                    答案: {formComponent}
                </div>
                <p className="score">
                    分值:{item.score}
                </p>
                <p className="text-green-600 text-lg font-bold border rounded-sm border-gray-400 p-2">
                    答案解析:{item.answerAnalyse}
                </p>
            </div>
        })
    }

    return <div className="w-[800px] mx-auto bg-blue-100 px-8 py-6 rounded-md">
        <Space direction="vertical" size="middle" className="w-full">

            <div className="text-4xl">
                得分: <span className="text-6xl text-red-400 font-bold">{score}</span>
            </div>
            <div className="flex flex-col  gap-4 ">
                {renderComponents(json)}
            </div>
        </Space>
        <Button type="primary" className="mt-4 w-full h-[40px]"><Link to="/">返回试卷列表</Link></Button>
    </div>

}
