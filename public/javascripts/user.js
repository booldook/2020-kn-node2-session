function joinSubmit(f) {
	if(f.userid.value.trim() == "") {
		return false;
	}
	if(f.userpw.value.trim() == "") {
		return false;
	}
	if(f.userpw2.value.trim() == "") {
		return false;
	}
	if(f.username.value.trim() == "") {
		return false;
	}
	return true;
}