import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DeviceInfo from 'react-native-device-info';
import {
  updateFirebaseIdToken,
  updateLoggedInUser,
} from './redux/features/authSlice';
import PasswordChanged from './screens/authentication/passwordchanged';
import ResetPassword from './screens/authentication/resetpassword';
import ForgotPassword from './screens/authentication/forgotpassword';
import Signup from './screens/authentication/signup';
import Login from './screens/authentication/login';
import SignupDone from './screens/authentication/signupdone';
import VerifyEmailCode from './screens/authentication/verifyEmailCode';
import HomeDrawer from './screens/home/homeDrawer.tsx';
import MessageChat from './screens/messaging/messageChat.tsx';
import SubleaseForm from './screens/sublease/sublease.tsx';
import AMPostDetails from './components/PostFlow/apartmentpostdetails.tsx';
import LookingPostDetails from './components/PostFlow/lookingpostdetails.tsx';
import OfferingPostDetails from './components/PostFlow/offeringpostdetails.tsx';
import MessageHome from './screens/messaging/messageHome.tsx';
import ViewProfile from './screens/profile/viewProfile';
import SetupProfile from './screens/profile/setupProfile';
import BasicinfoProfile from './screens/profile/basicinfoProfile';
import EducationProfile from './screens/profile/education.tsx';
import resumeProfile from './screens/profile/resume.tsx';
import experienceProfile from './screens/profile/Experience.tsx';
import SkillsProfile from './screens/profile/skills.tsx';
import LinksProfile from './screens/profile/links.tsx';
import EditProfile from './screens/profile/editProfile';
import QuickMessage from './components/newQuickMessage/quickmessage.tsx';
import EditLookingQuickMessage from './components/newQuickMessage/editlookingquickmessage.tsx';
import EditOfferingQuickMessage from './components/newQuickMessage/editofferingquickmessage.tsx';
import EditAMQuickMessage from './components/newQuickMessage/editamquickmessage.tsx';
import Invitefriendpage from './components/inviteFriends/invitefriendspage.tsx';
import YourPosts from './components/yourPosts/yourposts.tsx';
import SentPosts from './components/sentRequets/sentrequests.tsx';
import BottomNav from './components/BottomNav.tsx';
import HomeScreen from './screens/home/home.tsx';
import Verification from './screens/home/Dashboard/Verification.tsx';
import EmailVerification from './screens/home/Dashboard/emailvarification.tsx';
import Otpverification from './screens/home/Dashboard/otpverification.tsx';
import Schoolemail from './screens/home/Dashboard/Schoolemail.tsx';
import phoneverification from './screens/home/Dashboard/phoneverification.tsx';
import VerificationBluetick from './screens/home/Dashboard/verificationbluetick.tsx';
import VerificationScreen from './screens/home/Dashboard/verificationsuccess';
import RequestSuccess from './screens/sublease/request_success.tsx';
import FriendshipFlowHome from './screens/friendship/friendship_home.tsx';
import {RootState} from './redux/store.ts';

const Stack = createStackNavigator();

const RootComponent = () => {
  const dispatch = useDispatch();
  const id_token = useSelector(
    (state: RootState) => state.auth.firebaseIDToken,
  );
  const [loading, setLoading] = useState(true);

  const check_Id_Token = async () => {
    const id_token = await AsyncStorage.getItem('idToken');
    if (id_token !== null) {
      const userInfo = await AsyncStorage.getItem('userInfo');
      if (userInfo) {
        dispatch(updateLoggedInUser(JSON.parse(userInfo)));
      }
      const idToken = await AsyncStorage.getItem('idToken');
      if (idToken) {
        dispatch(updateFirebaseIdToken(idToken));
      }
    }
    setLoading(false); // Finished checking the token
  };

  useEffect(() => {
    check_Id_Token();
  }, []);

  if (loading) {
    // TODO Render a loading screen or null while checking the id token
    return null;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={id_token ? 'Auth/LoginDone' : 'Auth/Login'}
        screenOptions={{
          animationTypeForReplace: 'pop',
          headerShown: false,
          animationEnabled:
            DeviceInfo.getSystemVersion() === 'android' ? false : true,
        }}>
        {id_token ? (
          //logged in screens
          <>
            <Stack.Screen
              name="Auth/LoginDone"
              component={HomeDrawer}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="Profile/Edit"
              component={EditProfile}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="Profile/View"
              component={ViewProfile}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="Profile/setupProfile"
              component={SetupProfile}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="Profile/basicinfoProfile"
              component={BasicinfoProfile}
              options={{headerShown: false}}
            />
              <Stack.Screen
              name="Profile/Education"
              component={EducationProfile}
              options={{headerShown: false}}
            />
                <Stack.Screen
              name="Profile/Resume"
              component={resumeProfile}
              options={{headerShown: false}}
            /> 
              <Stack.Screen
            name="Profile/Experience"
            component={experienceProfile}
            options={{headerShown: false}}
          />
            <Stack.Screen
            name="Profile/Skills"
            component={SkillsProfile}
            options={{headerShown: false}}
          />   
           <Stack.Screen
          name="Profile/Links"
          component={LinksProfile}
          options={{headerShown: false}}
        />
            <Stack.Screen
              name="Messaging/Home"
              component={MessageHome}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="Messaging/Chat"
              component={MessageChat}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="Auth/SignupDone"
              component={SignupDone}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="Auth/PasswordChanged"
              component={PasswordChanged}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="Auth/VerifyEmailCode"
              component={VerifyEmailCode}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="Auth/ResetPassword"
              component={ResetPassword}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="Auth/ForgotPassword"
              component={ForgotPassword}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="Auth/Signup"
              component={Signup}
              options={{headerShown: false}}
            />
            {/* <Stack.Screen
              name="Home"
              component={BottomNav}
              options={{headerShown: false}}
            /> */}
            <Stack.Screen
              name="Screens/subleaseForm"
              component={SubleaseForm}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="Screens/ApartmentPostDetails"
              component={AMPostDetails}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="Screens/LookingPostDetails"
              component={LookingPostDetails}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="Screens/OfferingPostDetails"
              component={OfferingPostDetails}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="Screens/QuickMessage"
              component={QuickMessage}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="Screens/Dashboard/EditLookingQuickMessage"
              component={EditLookingQuickMessage}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="Screens/Dashboard/EditOfferingQuickMessage"
              component={EditOfferingQuickMessage}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="Screens/Dashboard/EditAMQuickMessage"
              component={EditAMQuickMessage}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="Screens/Dashboard/InviteFriend"
              component={Invitefriendpage}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="Screens/Dashboard/YourPosts"
              component={YourPosts}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="Screens/Dashboard/SentRequests"
              component={SentPosts}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="Screens/HomeScreen"
              component={HomeScreen}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="BottomNav"
              component={BottomNav}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="Screens/Dashboard/Verification"
              component={Verification}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="EmailVerification"
              component={EmailVerification}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="Schoolemail"
              component={Schoolemail}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="phoneverification"
              component={phoneverification}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="OtpVerification"
              component={Otpverification}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="verification-bluetick"
              component={VerificationBluetick}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="verificationsuccess"
              component={VerificationScreen}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="Screens/FriendshipFlow"
              component={FriendshipFlowHome}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="Screens/RequestSuccess"
              component={RequestSuccess}
              options={{headerShown: false}}
            />
          </>
        ) : (
          // authentication screens (non - login screens)
          <>
            <Stack.Screen
              name="Auth/Login"
              component={Login}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="Profile/Edit"
              component={EditProfile}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="Profile/View"
              component={ViewProfile}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="Messaging/Home"
              component={MessageHome}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="Messaging/Chat"
              component={MessageChat}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="Auth/LoginDone"
              component={HomeDrawer}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="Auth/SignupDone"
              component={SignupDone}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="Auth/PasswordChanged"
              component={PasswordChanged}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="Auth/VerifyEmailCode"
              component={VerifyEmailCode}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="Auth/ResetPassword"
              component={ResetPassword}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="Auth/ForgotPassword"
              component={ForgotPassword}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="Auth/Signup"
              component={Signup}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="Home"
              component={BottomNav}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="Screens/subleaseForm"
              component={SubleaseForm}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="Screens/ApartmentPostDetails"
              component={AMPostDetails}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="Screens/LookingPostDetails"
              component={LookingPostDetails}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="Screens/OfferingPostDetails"
              component={OfferingPostDetails}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="Screens/QuickMessage"
              component={QuickMessage}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="Screens/Dashboard/EditLookingQuickMessage"
              component={EditLookingQuickMessage}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="Screens/Dashboard/EditOfferingQuickMessage"
              component={EditOfferingQuickMessage}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="Screens/Dashboard/EditAMQuickMessage"
              component={EditAMQuickMessage}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="Screens/Dashboard/InviteFriend"
              component={Invitefriendpage}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="Screens/Dashboard/YourPosts"
              component={YourPosts}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="Screens/Dashboard/SentRequests"
              component={SentPosts}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="Screens/HomeScreen"
              component={HomeScreen}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="BottomNav"
              component={BottomNav}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="Screens/Dashboard/Verification"
              component={Verification}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="EmailVerification"
              component={EmailVerification}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="Schoolemail"
              component={Schoolemail}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="phoneverification"
              component={phoneverification}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="OtpVerification"
              component={Otpverification}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="verification-bluetick"
              component={VerificationBluetick}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="verificationsuccess"
              component={VerificationScreen}
              options={{headerShown: false}}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default RootComponent;
