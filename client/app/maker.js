const handleDomo = (e) => {
	e.preventDefault();

	$("#domoMessage").animate({ width: 'hide' }, 350);

	if ($().val("#domoName") == '' || $("#domoAge").val() == '') {
		handleError("RAWR! All fields are required");
		return false;
	}

	sendAjax('POST', $("#domoForm").attr("action"), $("#domoForm").serialize(), function () {
		loadDomosFromServer();
	});

	return false;
}

const DomoForm = (props) => {
	return (
		<form id="domoForm"
			name="domoForm"
			onSubmit={handleDomo}
			action="/maker"
			method="POST"
			className="domoForm"
		>
			<label htmlFor="name">Name: </label>
			<input id="domoName" type="text" name="name" placeholder="Domo Name"></input>
			<label htmlFor="age">Age: </label>
			<input id="domoAge" type="text" name="age" placeholder="Domo Age"></input>
			<input type="hidden" name="_csrf" value={props.csrf}></input>
			<input className="makeDomoSubmit" type="submit" value="Make Domo"></input>
		</form>
	);
};

const DomoList = function (props) {
	if (props.domos.length === 0) {
		return (
			<div className="domoList">
				<h3 className="emptyDomo">No Domos yet</h3>
			</div>
		);
	}

	const domoNodes = props.domos.map(function (domo) {
		return (
			<div key={domo._id} className="domo">
				<img src="/assets/img/domoface.jpeg" alt="domo face" className="domoFace" />
				<h3 className="domoName"> Name: {domo.name} </h3>
				<h3 className="domoAge"> Age: {domo.age} </h3>
			</div>	
		);
	});

	return (
		<div className="domoList">
			{domoNodes}
		</div>	
	);
};

const UserProfile = function (props) {
	return (
		<div>
			<h3>Username: </h3><p> {props.profile.username}</p>
			<h3>Age: </h3><p> {props.profile.age}</p>
			<h3>Date Created: </h3><p> {props.profile.createdDate}</p>
		</div>
	);
};

const loadDomosFromServer = () => {
	sendAjax('GET', '/getDomos', null, (data) => {
		ReactDOM.render(
			<DomoList domos={data.domos} />, document.querySelector("#domos")
		);
	});
};

const createDomoWindow = (csrf) => {
	ReactDOM.render(
		<DomoForm csrf={csrf} />, document.querySelector("#makeDomo")
	);

	ReactDOM.render(
		<DomoList domos={[]} />, document.querySelector("#domos")
	);

	loadDomosFromServer();
};

const createProfileWindow = () => {
	ReactDOM.render(
		null, document.querySelector("#makeDomo")
	);

	sendAjax('GET', '/getProfile', null, (data) => {
		ReactDOM.render(
			<UserProfile profile={data.profile} />, document.querySelector("#domos")
		);
	});
};

const setup = function (csrf) {
	const domoButton = document.querySelector("#showDomos");
	const profileButton = document.querySelector("#showProfile");

	domoButton.addEventListener("click", (e) => {
		e.preventDefault();
		createDomoWindow(csrf);
		return false;
	});

	profileButton.addEventListener("click", (e) => {
		e.preventDefault();
		createProfileWindow();
		return false;
	});

	createDomoWindow(csrf);
};

const getToken = () => {
	sendAjax('GET', '/getToken', null, (result) => {
		setup(result.csrfToken);
	});
};

$(document).ready(function () {
	getToken();
});