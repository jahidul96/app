import {StyleSheet, Text, View, ScrollView} from "react-native";
import React, {useState} from "react";
import {
	ButtonComp,
	Input,
	SelectPositionComp,
	TopBar,
} from "../components/Reuse";
import {DepartmentComp} from "./SelectDepartment";
import {bgColor} from "./StudentList";
import {addDoc, collection, Timestamp} from "firebase/firestore";
import {db} from "../firebase/firebase";
import {
	commonWrapper,
	pageTopbarStye,
} from "../components/similarstyles/SimillarStyles";
import {courseData, positionData} from "../data/alldata";

const AddTeacher = ({navigation}) => {
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [phone, setPhone] = useState("");
	const [addres, setAddres] = useState("");
	const [selectedPositon, setSelectedPosition] = useState("");
	const [selectedSubject, setSelectedSubject] = useState("");

	const [showdesignationmodel, setDesignationShowModel] = useState(false);
	const [showsubjectmodel, setSubjectShowModel] = useState(false);

	const selectDesignation = (t) => {
		setSelectedPosition(t);
	};
	const selectSubject = (t) => {
		setSelectedSubject(t);
	};

	const positionModelStyle = {
		top: "39%",
	};
	const subjectModelStyle = {
		top: "47%",
	};

	const addTeacher = async () => {
		let e = "@";
		let com = ".com";

		let teacheremail = email.toLowerCase();

		if (
			!name ||
			!email ||
			!addres ||
			!phone ||
			!selectedPositon ||
			!selectedSubject
		) {
			return alert("please fill all the field");
		}

		if (!email.includes(e) || !email.includes(com)) {
			return alert("invalid email format");
		}

		if (phone.length > 11 || phone.length < 11) {
			return alert("invalid phone number!");
		}
		try {
			await addDoc(collection(db, "teachers"), {
				name,
				email: teacheremail,
				phone,
				addres,
				position: selectedPositon,
				subject: selectedSubject,
				createAt: Timestamp.fromDate(new Date()),
			});
			navigation.navigate("teacherlist");
			alert("document added");
		} catch (error) {
			alert(error.message);
		}
	};
	return (
		<View style={styles.root}>
			<View style={pageTopbarStye}>
				<TopBar navigation={navigation} text="Add Teacher" />
			</View>
			<ScrollView contentContainerStyle={commonWrapper}>
				<Input placeholder="name" setValue={setName} />
				<Input placeholder="email" setValue={setEmail} />
				<Input placeholder="addres" setValue={setAddres} />
				<Input placeholder="phone" setValue={setPhone} />
				<View
					style={{
						marginTop: 10,
					}}
				>
					<DepartmentComp
						text="select Position"
						setShowModel={setDesignationShowModel}
						value={selectedPositon}
					/>
					<DepartmentComp
						text="select subject"
						setShowModel={setSubjectShowModel}
						value={selectedSubject}
					/>
				</View>

				<ButtonComp
					text="Submit"
					bgColor={bgColor}
					click={addTeacher}
				/>

				{showdesignationmodel && (
					<SelectPositionComp
						setShowModel={setDesignationShowModel}
						text="Select Designation"
						data={positionData}
						selectValue={selectDesignation}
						extrastyle={positionModelStyle}
					/>
				)}
				{showsubjectmodel && (
					<SelectPositionComp
						setShowModel={setSubjectShowModel}
						text="Select Subject"
						data={courseData}
						extrastyle={subjectModelStyle}
						selectValue={selectSubject}
					/>
				)}
			</ScrollView>
		</View>
	);
};

export default AddTeacher;

const styles = StyleSheet.create({
	root: {
		flex: 1,
	},
});
