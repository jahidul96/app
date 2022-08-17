import {
	Pressable,
	ScrollView,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from "react-native";
import React, {useEffect, useState} from "react";
import {TopBar} from "../components/Reuse";
import {COLORS} from "../styles/Colors";
import Icon from "react-native-vector-icons/AntDesign";
import {doc, onSnapshot, setDoc, updateDoc} from "firebase/firestore";
import {db} from "../firebase/firebase";

const myIcon = <Icon name="caretup" size={16} color={COLORS.grayColor} />;

const StudentDatabase = ({route, navigation}) => {
	const {courseId} = route.params;
	const [courseStudents, setCourseStudent] = useState([]);
	const [cliked, setCliked] = useState(false);

	const markAttendence = async () => {
		try {
			const data = courseStudents.map((item) => {
				item = {...item, present: "present"};
				return item;
			});
			await updateDoc(
				doc(db, "courses", courseId),
				{
					students: data,
				},
				{merge: true}
			);
			setCliked(!cliked);
		} catch (error) {
			alert("something went wrong");
		}
	};

	const markOneStudentAttendence = async (val, text) => {
		if (text == "present") {
			const data = courseStudents.map((item) => {
				if (item.studentMail === val.studentMail) {
					item = {...item, present: "present"};
				}
				return item;
			});
			await setDoc(
				doc(db, "courses", courseId),
				{
					students: data,
				},
				{merge: true}
			);
		} else {
			const data = courseStudents.map((item) => {
				if (item.studentMail === val.studentMail) {
					item = {...item, present: "request"};
				}
				return item;
			});

			await setDoc(
				doc(db, "courses", courseId),
				{
					students: data,
				},
				{merge: true}
			);
		}
	};

	useEffect(() => {
		onSnapshot(doc(db, "courses", courseId), (doc) => {
			setCourseStudent(doc.data().students);
		});
	}, []);
	return (
		<View>
			<View style={styles.headStyle}>
				<TopBar text="Present Student" navigation={navigation} />
			</View>
			<ScrollView contentContainerStyle={styles.wrapper}>
				<View style={styles.topView}>
					<View
						style={[
							styles.studentIdView,
							styles.studentIdViewStyle2,
						]}
					>
						<Text style={styles.text}>Students</Text>
					</View>

					<TouchableOpacity
						style={[
							styles.studentIdView,
							styles.mark,
							cliked && styles.markAllBgChange,
						]}
						onPress={markAttendence}
					>
						<Text style={[styles.text, styles.whiteText]}>
							Mark All
						</Text>
					</TouchableOpacity>
				</View>

				{courseStudents.length ? (
					courseStudents.map((data, i) => (
						<StudentInfo
							key={i}
							data={data}
							markAt={markOneStudentAttendence}
						/>
					))
				) : (
					<Text style={styles.nullText}>No students presents</Text>
				)}
			</ScrollView>
		</View>
	);
};

export default StudentDatabase;

const StudentInfo = ({data, markAt}) => {
	return (
		<View style={styles.topView}>
			<View
				style={[
					styles.studentIdView,
					data.present == "present" && styles.studentIdViewStyle2,
				]}
			>
				<Text style={styles.text}>{data.studentMail}</Text>
			</View>

			{data.present == "present" ? (
				<Pressable
					style={[
						styles.studentIdView,
						styles.mark,
						styles.markBgStyle,
					]}
					onPress={() => markAt(data)}
				>
					<Text style={[styles.text, styles.whiteText]}>Unmark</Text>
				</Pressable>
			) : (
				<Pressable
					style={[styles.studentIdView, styles.mark]}
					onPress={() => markAt(data, "present")}
				>
					<Text style={[styles.text, styles.whiteText]}>Mark</Text>
				</Pressable>
			)}
		</View>
	);
};

// //presentDate
const styles = StyleSheet.create({
	headStyle: {
		height: "25%",
		justifyContent: "center",
		backgroundColor: COLORS.lightBlue,
		paddingTop: 30,
		paddingHorizontal: 10,
	},
	wrapper: {
		backgroundColor: COLORS.lightYellow,
		width: "100%",
		minHeight: 100,
		padding: 10,
		borderRadius: 5,
	},
	topView: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginBottom: 10,
	},
	studentIdView: {
		width: "65%",
		backgroundColor: COLORS.grayColor,
		flexDirection: "row",
		justifyContent: "center",
		alignItems: "center",
		minHeight: 40,
		borderRadius: 5,
	},

	studentIdViewStyle2: {
		width: "65%",
		backgroundColor: COLORS.lightBlue,
	},
	mark: {
		width: "30%",
		backgroundColor: COLORS.red,
	},
	markAllBgChange: {
		backgroundColor: COLORS.grayColor,
	},
	text: {
		fontSize: 17,
		fontFamily: "Helvetica-Bold",
		color: COLORS.white,
	},
	whiteText: {
		color: COLORS.white,
	},
	extraStyle: {
		justifyContent: "space-evenly",
	},
	btnText: {
		fontSize: 12,
		fontFamily: "Helvetica-Bold",
		color: COLORS.white,
	},
	nullText: {
		textAlign: "center",
		marginVertical: 10,
		fontFamily: "Helvetica-Bold",
		fontSize: 16,
	},
	markBgStyle: {
		backgroundColor: COLORS.brown,
	},
});
