import api from "../api/api";

function WorkLogList({
    workLogs,
    loadWorkLogs,
    startEdit
}) {

    const deleteWorkLog = async (id) => {

        if (!window.confirm("정말 삭제하시겠습니까?")) {
            return;
        }

        try {

            await api.delete(`/api/work/${id}`);

            loadWorkLogs();

        } catch (error) {

            console.error(error);

            alert("삭제 실패");

        }

    };

    return (

        <div>

            {workLogs.map((log) => (

                <div
                    key={log.id}
                    style={{
                        border: "1px solid gray",
                        padding: "15px",
                        marginBottom: "10px"
                    }}
                >

                    <h3>{log.title}</h3>

                    <p>{log.content}</p>

                    <div
                        style={{
                            display: "flex",
                            gap: "10px"
                        }}
                    >

                        <button
                            onClick={() => startEdit(log)}
                        >
                            수정
                        </button>

                        <button
                            onClick={() => deleteWorkLog(log.id)}
                        >
                            삭제
                        </button>

                    </div>

                </div>

            ))}

        </div>

    );

}

export default WorkLogList;