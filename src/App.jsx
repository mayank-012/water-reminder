import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Home from "./components/Home";
import Weather from "./components/Weather";
import PrivateRoute from "./components/PrivateRoute";
import ProgressTracker from "./components/ProgressTracker";
import "./App.css";
import WaterIntake from "./components/WaterIntake";
import Timer from "./components/Timer";
import Navbar from "./components/Navbar";
import ProgressGraph from "./components/ProgressGraph";
import Badges from "./components/Badges";
import UserProfile from "./components/UserProfile";
import { calculateDailyWaterIntake } from "./components/CalculateDailyWaterIntake";
import {
  db,
  collection,
  query,
  where,
  getDocs,
  getDoc,
  doc,
  setDoc,
  addDoc,
  deleteDoc,
} from "./Firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "./Firebase";
import { format, subDays } from "date-fns";
import "./App.css";
import SocialShare from "./components/Socialshare";
import { notify } from "./components/Notification";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
  const [weather, setWeather] = useState({});
  const [waterIntake, setWaterIntake] = useState(0);
  const [nextReminderTime, setNextReminderTime] = useState(
    new Date().getTime()
  );
  const [dailyGoal, setDailyGoal] = useState(2.7);
  const [profile, setProfile] = useState({
    weight: "",
    age: "",
    activityLevel: "Moderate",
    gender: "Female",
  });

  const [user] = useAuthState(auth);
  const [formVisible, setFormVisible] = useState(false);
  const [badges, setBadges] = useState([]);
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: "Water Intake (ml)",
        data: [],
        backgroundColor: "rgba(75,192,192,0.2)",
        borderColor: "rgba(75,192,192,1)",
        borderWidth: 1,
        fill: true,
      },
    ],
  });

  const playSound = (url) => {
    const audio = new Audio(url);
    audio.play();
  };
  useEffect(() => {
    const r = async () => {
      if (waterIntake < dailyGoal * 1000) {
        const today = format(new Date(), "yyyy-MM-dd");
        await removeBadge("Hydration Master", today);
      }
    };
    r();
  }, [dailyGoal]);

  useEffect(() => {
    if (user) {
      const saveWaterIntake = async () => {
        const today = format(new Date(), "yyyy-MM-dd"); 
        const waterIntakeRef = collection(db, "waterIntakes");
        const q = query(
          waterIntakeRef,
          where("userId", "==", user.uid),
          where("date", "==", today)
        );
        const querySnapshot = await getDocs(q);

        try {
          let newIntake = waterIntake;
          if (!querySnapshot.empty) {
            querySnapshot.forEach(async (docSnapshot) => {
              newIntake = waterIntake;
              await setDoc(
                docSnapshot.ref,
                { intake: newIntake, goal: dailyGoal },

                { merge: true }
              );
            });
          } else {
            await addDoc(waterIntakeRef, {
              userId: user.uid,
              date: today,
              intake: newIntake,
              goal: dailyGoal,
            });
          }
          if (newIntake >= dailyGoal * 1000) {
            await awardBadge("Hydration Master", today);
          }
        } catch (error) {
          console.error("Error saving water intake:", error);
        }
      };
      saveWaterIntake();
    }
  }, [waterIntake]);

  const awardBadge = async (badgeName, date) => {
    const badgesRef = collection(db, "badges");
    const q = query(
      badgesRef,
      where("userId", "==", user.uid),
      where("badgeName", "==", badgeName),
      where("date", "==", date)
    );
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      playSound("/assets/drank.wav");
            notify("You earned a badge of Hydration Master!");
      await addDoc(badgesRef, {
        userId: user.uid,
        badgeName: badgeName,
        date: date,
      });

      setBadges((prevBadges) => [
        ...prevBadges,
        { badgeName: badgeName, date: date },
      ]);
    }
  };

  const removeBadge = async (badgeName, date) => {
    if (user) {
      const badgesRef = collection(db, "badges");
      const q = query(
        badgesRef,
        where("userId", "==", user.uid),
        where("badgeName", "==", badgeName),
        where("date", "==", date)
      );
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        querySnapshot.forEach(async (docSnapshot) => {
          await deleteDoc(docSnapshot.ref);
        });

        setBadges((prevBadges) =>
          prevBadges.filter(
            (badge) => !(badge.badgeName === badgeName && badge.date === date)
          )
        );
      }
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        try {
          const userDoc = await getDoc(doc(db, "users", user.uid));
          if (userDoc.exists()) {
            setProfile(userDoc.data());
            setFormVisible(false);
          } else {
            setFormVisible(true);
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    };
    fetchUserData();
  }, [user]);

  useEffect(() => {
    const fetchWaterIntake = async () => {
      if (user) {
        const today = format(new Date(), "yyyy-MM-dd"); 
        const waterIntakeRef = collection(db, "waterIntakes");
        const q = query(
          waterIntakeRef,
          where("userId", "==", user.uid),
          where("date", "==", today)
        );
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          querySnapshot.forEach((docSnapshot) => {
            setWaterIntake(docSnapshot.data().intake);
          });
        } else {
          setWaterIntake(0);
        }
      }
    };
    fetchWaterIntake();
  }, [user]);
  useEffect(() => {
    const fetchBadges = async () => {
      if (user) {
        const badgesRef = collection(db, "badges");
        const q = query(badgesRef, where("userId", "==", user.uid));
        const querySnapshot = await getDocs(q);

        const fetchedBadges = [];
        querySnapshot.forEach((docSnapshot) => {
          fetchedBadges.push(docSnapshot.data());
        });

        setBadges(fetchedBadges);
      }
    };
    fetchBadges();
  }, [user]);

  const calculateInterval = () => {
    let interval = 60;

    if (weather.temp > 30) interval -= 10;
    else if (weather.temp < 10) interval += 10;

    if (weather.humidity > 70) interval -= 10;
    else if (weather.humidity < 30) interval += 10;

    if (profile.weight > 90) interval -= 5;
    else if (profile.weight < 50) interval += 5;

    if (profile.activityLevel === "high") interval -= 10;
    else if (profile.activityLevel === "low") interval += 10;

    if (profile.age > 50) interval += 5;
    else if (profile.age < 18) interval += 5;

    if (profile.gender === "male") interval -= 5;
    else interval += 5;

    const intakePercentage = (waterIntake / (1000 * dailyGoal)) * 100;
    if (intakePercentage < 50) interval -= 10;
    else if (intakePercentage < 75) interval -= 5;
    else interval += 5;

    return Math.max(interval, 15);
  };

  const resetTimer = () => {
    const interval = calculateInterval();
    const nextTime = new Date().getTime() + interval * 60 * 1000;
    setNextReminderTime(nextTime);
  };

  const resetProgress = async () => {
    setWaterIntake(0);
    resetTimer();
    const today = format(new Date(), "yyyy-MM-dd");
    await removeBadge("Hydration Master", today);
  };

  useEffect(() => {
    if (
      weather.temp &&
      weather.humidity &&
      profile.weight !== "" &&
      profile.age !== ""
    ) {
      const newDailyGoal = calculateDailyWaterIntake(
        weather.temp,
        weather.humidity,
        profile.weight,
        profile.activityLevel,
        profile.age,
        profile.gender
      );
      setDailyGoal(newDailyGoal);
      const interval = calculateInterval();
      const nextTime = new Date().getTime() + interval * 60 * 1000;
      setNextReminderTime(nextTime);

      const timer = setInterval(() => {
        notify("You need to drink water!");
      }, interval * 60 * 1000);

      return () => clearInterval(timer);
    }
  }, [weather, waterIntake, profile]);

  useEffect(() => {
    const fetchData = async () => {
      if (user) {
        const waterIntakeRef = collection(db, "waterIntakes");
        const today = format(new Date(), "yyyy-MM-dd");
        const past10Days = Array.from({ length: 10 }, (_, i) =>
          subDays(new Date(), i)
        ).map((date) => format(date, "yyyy-MM-dd"));

        const intakePromises = past10Days.map(async (date) => {
          if (date === today) {
            return { date, intake: waterIntake };
          } else {
            const q = query(
              waterIntakeRef,
              where("userId", "==", user.uid),
              where("date", "==", date)
            );
            const querySnapshot = await getDocs(q);
            let intake = 0;
            querySnapshot.forEach((docSnapshot) => {
              intake = docSnapshot.data().intake;
            });
            return { date, intake };
          }
        });

        const intakeData = await Promise.all(intakePromises);

        setChartData({
          labels: intakeData.map((data) => data.date),
          datasets: [
            {
              label: "Water Intake (ml)",
              data: intakeData.map((data) => data.intake),
              backgroundColor: "rgba(75,192,192,0.2)",
              borderColor: "rgba(75,192,192,1)",
              borderWidth: 1,
              fill: true,
            },
          ],
        });
      }
    };
    fetchData();
  }, [user, waterIntake]);

  return (
    <Router>
      <div>
        <Routes>
          {/* <Route path="/" element={<Navigate to="/welcome" />} /> */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route
            path="/home"
            element={
              <PrivateRoute>
                <Navbar />
                <div className="container-1">
                  <UserProfile
                    setProfile={setProfile}
                    profile={profile}
                    formVisible={formVisible}
                    setFormVisible={setFormVisible}
                  />

                  <ProgressTracker
                    waterIntake={waterIntake}
                    dailyGoal={parseFloat(dailyGoal)}
                    resetProgress={resetProgress}
                  />

                  <WaterIntake
                    setWaterIntake={setWaterIntake}
                    resetTimer={resetTimer}
                  />
                </div>

                <div className="container-2">
                  <Weather setWeather={setWeather} />

                  <Timer nextReminderTime={nextReminderTime} />

                  <ProgressGraph chartData={chartData} />
                </div>

                <div className="container-3">
                <Badges badges={badges} />
               
               <SocialShare waterIntake={waterIntake} dailyGoal={dailyGoal} />
                </div>
                  
                <div className="footer">
                  <p>© 2024 PaniPal. All rights reserved.</p>
                </div>
      <ToastContainer />

              </PrivateRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
