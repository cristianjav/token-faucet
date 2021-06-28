import { Alert } from "react-bootstrap";

const Message = (props) => {
    return (
        <div>
            <Alert variant='info'>
                {props.balance}
            </Alert>
        </div>
    );
}

export default Message;