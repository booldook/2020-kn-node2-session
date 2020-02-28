function onSubmit(f) {
	if(f.title.value.trim() == '') {
		alert('제목을 입력하세요.');
		f.title.focus();
		return false;
	}
	if(f.writer.value.trim() == '') {
		alert('작성자를 입력하세요.');
		f.writer.focus();
		return false;
	}
	if(f.content.value.trim() == '') {
		alert('내용을 입력하세요.');
		f.content.focus();
		return false;
	}
	return true;
}

$(".bt-rev-file").click(function onRevFile() {
	if(confirm("정말로 삭제하시겠습니까?")) {
		var id = $(this).data("id");
		var file = $(this).data("file");
		console.log('/board/remove?file='+file+'&id='+id);
		$.get('/board/remove?file='+file+'&id='+id).then(function(res) {
			if(res.code == 200) {
				$(".bt-rev-file").parent().remove();
			}
			else {
				alert("파일 삭제가 실패하였습니다.");
			}
		}).catch(function(xhr) {
			console.log(xhr);
		})
	}
});

function deleteData(id) {
	if(confirm("정말로 삭제하시겠습니까?")) {
		location.href = '/board/delete/'+id;
	}
}
