function WorkLogForm({
    title,
    setTitle,
    content,
    setContent,
    saveWorkLog,
    editing
}) {

    return (
        <div>

            <h2>
                {editing ? "업무일지 수정" : "업무일지 작성"}
            </h2>

            <input
                type="text"
                placeholder="제목을 입력하세요."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                style={{
                    width: "400px",
                    padding: "10px",
                    marginBottom: "10px"
                }}
            />

            <br />

            <textarea
                placeholder="업무 내용을 입력하세요."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={6}
                style={{
                    width: "400px",
                    padding: "10px"
                }}
            />

            <br />

            <button
                onClick={saveWorkLog}
                style={{
                    marginTop: "10px",
                    padding: "10px 20px"
                }}
            >
                {editing ? "수정" : "저장"}
            </button>

        </div>
    );
}

export default WorkLogForm;