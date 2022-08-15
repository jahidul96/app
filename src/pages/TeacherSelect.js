import {
	StyleSheet,
	Text,
	View,
	ScrollView,
	TouchableOpacity,
} from "react-native";
import React, {useEffect, useState} from "react";
import {ButtonComp, TextTitle} from "../components/Reuse";
import {selectStyle} from "../components/similarstyles/SimillarStyles";
import {COLORS} from "../styles/Colors";
import {Course} from "./StudentPresent";
import {onAuthStateChanged} from "firebase/auth";
import {auth, db} from "../firebase/firebase";
import {
	getDoc,
	doc,
	onSnapshot,
	query,
	where,
	collection,
} from "firebase/firestore";
import {signOut} from "firebase/auth";

const bgColor = {
	backgroundColor: COLORS.brown,
	width: "50%",
	height: 40,
	borderRadius: 10,
	marginTop: 10,
};

const btnTextStyle = {
	color: COLORS.white,
	fontSize: 16,
	fontFamily: "Helvetica-Bold",
};

const TeacherSelect = ({navigation, route}) => {
	const [validuser, setVaildUser] = useState("");
	const [mycourses, setMyCourses] = useState([]);

	const selectCourse = async (title, id) => {
		const ref = doc(db, "courses", id);
		const docSnap = await getDoc(ref);
		let students;
		if (docSnap.exists()) {
			students = docSnap.data();
			navigation.navigate("seeallStudent", {id, students});
		} else {
			console.log("No such document!");
		}
	};

	const logOut = async () => {
		await signOut(auth);
		setTimeout(() => {
			navigation.navigate("entry");
		}, 1000);
	};

	useEffect(() => {
		onAuthStateChanged(auth, (user) => {
			if (user) {
				const q = query(
					collection(db, "courses"),
					where("teacheremail", "==", user.email)
				);

				onSnapshot(q, (querySnapshot) => {
					let tCourse = [];
					querySnapshot.forEach((doc) => {
						tCourse.push({value: doc.data(), id: doc.id});
					});
					setMyCourses(tCourse);
				});
				setVaildUser(user.email);
			} else {
				console.log("user not found");
			}
		});
	}, []);

	return (
		<ScrollView>
			<View style={styles.root}>
				<TextTitle />
			</View>
			<View style={styles.wrapper}>
				<View style={selectStyle}>
					<Text style={styles.text}>See Attendence</Text>
				</View>

				{mycourses.length ? (
					mycourses.map((data) => (
						<Course
							key={data.id}
							data={data}
							select={selectCourse}
						/>
					))
				) : (
					<Text style={styles.emptyText}>No courses available</Text>
				)}
				<ButtonComp
					text="Logout"
					bgColor={bgColor}
					btnTextStyle={btnTextStyle}
					click={logOut}
				/>
			</View>
		</ScrollView>
	);
};

export default TeacherSelect;

const styles = StyleSheet.create({
	root: {
		paddingVertical: 100,
	},
	wrapper: {
		alignItems: "center",
	},
	extraStyle: {
		backgroundColor: COLORS.grayColor,
		marginTop: -1,
		marginBottom: 30,
	},
	text: {
		fontFamily: "Helvetica-Bold",
		fontSize: 16,
	},
	emptyText: {
		textAlign: "center",
		fontSize: 16,
		marginTop: 10,
		fontFamily: "Helvetica-Bold",
	},
});
