import { Card, Popover } from "antd";
import { useDrag } from "react-dnd";

export function MaterialItem(props: { name: string, type: string }) {

    const [_, drag] = useDrag({
        type: props.type,
        item: {
            type: props.type
        }
    });

    return <Popover content={'拖拽至右侧题目区域'}>
        <Card hoverable ref={drag} className="text-center  bg-gradient-to-r from-sky-500 to-indigo-500">
            <span className="text-lg text-white">  {props.name}</span>
        </Card>
    </Popover>
}