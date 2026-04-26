import { useEffect, useState } from "react";

export function ButtonLog() {
    const apiUrl = 'http://localhost:3000';
    const [text, setText] = useState(null);

    useEffect(() => {
        fetch(apiUrl + '/helloThere')
            .then(res => res.json())
            .then(jsonData => setText(jsonData.ref));
    }, []);

    function handleClick() {
        fetch(apiUrl + ((text === 'uwu') ? '/helloThere' : '/uwu'))
            .then(res => res.json())
            .then(jsonData => setText(jsonData.ref));
    }
    return (
        <button onClick={handleClick}>UwU : {text}</button>
    );
}
