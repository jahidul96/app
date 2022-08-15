import {
	ScrollView,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from "react-native";
import React from "react";
import {TextTitle, TopBar} from "../components/Reuse";
import {COLORS} from "../styles/Colors";
import Icon from "react-native-vector-icons/AntDesign";
import {doc, setDoc, updateDoc} from "firebase/firestore";
import {db} from "../firebase/firebase";

const myIcon = <Icon name="caretup" size={16} color={COLORS.grayColor} />;

const StudentDatabase = ({route, navigation}) => {
	const {id, students} = route.params;

	const markAttendence = async () => {
		const data = students.students.map((item) => {
			item = {...item, present: "present"};
			return item;
		});
		await updateDoc(
			doc(db, "courses", id),
			{
				students: data,
			},
			{merge: true}
		);
	};

	const selectOneStudent = async (val) => {
		const data = students.students.map((item) => {
			if (item.studentMail === val.studentMail) {
				item = {...item, present: "present"};
			}
			return item;
		});

		await setDoc(
			doc(db, "courses", id),
			{
				students: data,
			},
			{merge: true}
		);
	};

	return (
		<View>
			<View style={styles.headStyle}>
				<TopBar text="Present Student" navigation={navigation} />
			</View>
			<ScrollView contentContainerStyle={styles.wrapper}>
				<View style={styles.topView}>
					<View style={styles.studentIdView}>
						<Text style={styles.text}>Students</Text>
					</View>
					<TouchableOpacity
						style={[styles.studentIdView, styles.mark]}
						onPress={markAttendence}
					>
						<Text style={[styles.text, styles.whiteText]}>
							Mark All
						</Text>
					</TouchableOpacity>
				</View>

				{students.students.length ? (
					students.students.map((data, i) => (
						<StudentInfo key={i} data={data} />
					))
				) : (
					<Text style={styles.nullText}>No students presents</Text>
				)}
			</ScrollView>
		</View>
	);
};

export default StudentDatabase;

const StudentInfo = ({data}) => {
	const seeDate = () => {
		alert(Date.now());
	};
	return (
		<View style={styles.topView}>
			<TouchableOpacity
				style={[styles.studentIdView, styles.studentIdViewStyle2]}
				onPress={() => seeDate(data)}
			>
				<Text style={styles.text}>{data.studentMail}</Text>
			</TouchableOpacity>
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
		backgroundColor: COLORS.brown,
		flexDirection: "row",
		justifyContent: "center",
		alignItems: "center",
		minHeight: 40,
		borderRadius: 5,
	},

	studentIdViewStyle2: {
		width: "100%",
		backgroundColor: COLORS.lightBlue,
	},
	mark: {
		width: "30%",
		backgroundColor: COLORS.red,
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
});
