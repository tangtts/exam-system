import { Button, Card, Divider, message, Popconfirm, Popover, Space } from "antd";
import { useEffect, useState } from "react";
import { answerExport, examDelete, examList, examPublish, examUnpublish } from "../../interfaces";
import { ExamAddModal } from "./ExamAddModal";
import { Link } from "react-router-dom";
import { RankingModal } from "./RankingModal";

interface Exam {
    id: number
    name: string
    isPublish: boolean
    isDelete: boolean
    content: string
}

export function ExamList() {

    const [list, setList] = useState<Array<Exam>>();
    const [isExamAddModalOpen, setIsExamAddModalOpen] = useState(false);
    const [isRankingModalOpen, setIsRankingModalOpen] = useState(false);
    const [curExamId, setCurExamId] = useState<number>();

    async function query() {
        try {
            const res = await examList();
            if (res.status === 201 || res.status === 200) {
                setList(res.data)
            }
        } catch (e: any) {
            message.error(e.response?.data?.message || '系统繁忙，请稍后再试');
        }
    }

    async function changePublishState(id: number, publish: boolean) {
        try {
            const res = publish ? await examUnpublish(id) : await examPublish(id);
            if (res.status === 201 || res.status === 200) {
                message.success(publish ? '已取消发布' : '已发布');
                query();
            }
        } catch (e: any) {
            message.error(e.response?.data?.message || '系统繁忙，请稍后再试');
        }
    }

    async function deleteExam(id: number) {
        try {
            const res = await examDelete(id);
            if (res.status === 201 || res.status === 200) {
                message.success('已删除');
                query();
            }
        } catch (e: any) {
            message.error(e.response?.data?.message || '系统繁忙，请稍后再试');
        }
    }

    async function downloadExcel(examId: number) {
        try {
            const res = await answerExport(examId);
            if (res.status === 201 || res.status === 200) {
                message.success('导出成功');
            }
        } catch (e: any) {
            message.error(e.response?.data?.message || '系统繁忙，请稍后再试');
        }
    }

    useEffect(() => {
        query()
    }, []);

    const [bin, setBin] = useState(false);

    return <div>
        <h1 className="text-4xl">考试系统</h1>
        <div className="mt-4">
            <div className="my-4">
                <Space>
                    <Button type="primary" onClick={() => {
                        setIsExamAddModalOpen(true);
                    }}>新建试卷</Button>
                    <Button onClick={() => {
                        setBin(bin => !bin)
                    }}>{bin ? '退出回收站' : '打开回收站'}</Button>
                </Space>
            </div>

            <div>
                {
                    // bin为true 是回收站
                    list?.filter(item => {
                        return bin ? item.isDelete === true : item.isDelete === false
                    }).map(item => {
                        return <Card key={item.id} hoverable className="mb-6 bg-gradient-to-r from-cyan-500 to-blue-500">
                            <div className="text-white text-lg mb-4 font-bold">
                                {item.name}
                            </div>
                            <Space>
                                <Button type={item.isPublish ? 'default' : 'primary'} onClick={() => {
                                    changePublishState(item.id, item.isPublish);
                                }}>{item.isPublish ? '停止' : '发布'}</Button>

                                <Button type="primary" className="bg-orange-400">
                                    <Link to={`/edit/${item.id}`}>编辑</Link>
                                </Button>

                                <Popover content={<Button type="link" onClick={() => {
                                    window.open(window.location.origin + '/exam/' + item.id)
                                }}>{window.location.origin + '/exam/' + item.id}</Button>
                                } trigger="hover">
                                    <Button type="primary" className="bg-teal-500">
                                        考试链接
                                    </Button>
                                </Popover>

                                <Button type="primary" onClick={() => {
                                    setIsRankingModalOpen(true)
                                    setCurExamId(item.id);
                                }}>
                                    排行榜
                                </Button>
                                <Button type="dashed">
                                    <a href={"http://localhost:3003/answer/export?examId=" + item.id} download>
                                        导出所有答卷
                                    </a>
                                </Button>
                                <Popconfirm
                                    title="试卷删除"
                                    description="确认放入回收站吗？"
                                    onConfirm={() => deleteExam(item.id)}
                                    okText="Yes"
                                    cancelText="No"
                                >
                                    {bin ? "" : <Button type="primary" className="bg-red-400">删除</Button>}
                                </Popconfirm>
                            </Space>
                        </Card>
                    })
                }
            </div>
        </div>

        <ExamAddModal isOpen={isExamAddModalOpen} handleClose={() => {
            setIsExamAddModalOpen(false);
            query();
        }} />

        <RankingModal isOpen={isRankingModalOpen} handleClose={() => {
            setIsRankingModalOpen(false);
        }} examId={curExamId} />
    </div>
}
