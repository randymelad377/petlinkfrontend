import { createBrowserRouter, createRoutesFromElements, Route } from "react-router-dom";

//LAYOUTS
import UsersLayout from "../layouts/UsersLayout";
import UserLayout from "../layouts/UserLayout";
import HomeLayout from "../layouts/HomeLayout";
import PetsLayout from "../layouts/PetsLayout";
import NotificationLayout from "../layouts/NotificationLayout";
import MessageLayout from "../layouts/MessageLayout";
import SettingLayout from "../layouts/SettingLayout";
import AuthLayout from "../layouts/AuthLayout";

//PAGES
import Register from "../pages/AuthPages/Register";
import Forget from "../pages/AuthPages/Forget";
import Login from "../pages/AuthPages/Login";
import Home from "../pages/homePages/Home";
import Pets from "../pages/petsPages/Pets";
import PetUpdate from "../pages/petsPages/PetUpdate";
import User from "../pages/usersPages/User";
import AvailableConvo from "../pages/messagePages/AvailableConvo";
import Notification from "../pages/notificationPages/Notifications";
import Setting from "../pages/settingPages/Setting";
import PetInfo from "../pages/petsPages/PetInfo";
import UserInfo from "../pages/usersPages/UserInfo";
import RequestForm from "../pages/settingPages/RequestForm";
import TranscationForm from "../pages/settingPages/TransactionForm";
import HistoryForm from "../pages/settingPages/HistoryForm";

//SETTING COMPONENTS
import BlockedUsers from "../components/settingComponents/BlockedUsers";
import ChangePassword from "../components/settingComponents/ChangePassword";
import History from "../components/settingComponents/History";
import PersonalInfo from "../components/settingComponents/PersonalInfo";
import RequestForms from "../components/settingComponents/RequestForms";
import SendConcern from "../components/settingComponents/SendConcern";
import Transaction from "../components/settingComponents/Transaction";
import UserPets from "../components/settingComponents/UserPets";
import TransactionForm from "../pages/settingPages/TransactionForm";

//ADMIN LAYOUT
import AdminLayoutAuth from "../layouts/AdminLayouts/AdminLayoutAuth";
import AdminDashboardLayout from "../layouts/AdminLayouts/AdminDashboardLayout";
import AdminSettingLayout from "../layouts/AdminLayouts/AdminSettingLayout";

//ADMIN PAGES
import AdminChangePass from "../pages/adminPages/AdminChangePass";
import AdminHome from "../pages/adminPages/AdminHome";
import AdminPets from "../pages/adminPages/AdminPets";
import AdminUsers from "../pages/adminPages/AdminUsers";
import AdminNotification from "../pages/adminPages/AdminNotification";
import AdminUser from "../pages/adminPages/AdminUser";
import AdminPet from "../pages/adminPages/AdminPet";
import AdminFeedback from "../pages/adminPages/AdminFeedback";
import AdminReport from "../pages/adminPages/AdminReport";

import AdminSetting from "../pages/adminPages/AdminPersonalInfo";
import AdminBanSuspend from "../pages/adminPages/AdminBanSuspend";
import Admins from "../pages/adminPages/Admins";

import { getService } from "../services/PetService";

import PageError from "../components/feedbackComponents/PageError";
import AdminMap from "../pages/adminPages/AdminMap";

const MyRouter = createBrowserRouter(
    createRoutesFromElements(
        <>
            <Route path="/register" element={<Register></Register>}></Route>
            <Route path="/login" element={<Login></Login>}></Route>
            <Route path="/forget" element={<Forget></Forget>}></Route>

            <Route element={<UserLayout></UserLayout>}>
                <Route path="/" element={<HomeLayout></HomeLayout>}>
                    <Route index element={<Home></Home>}></Route>
                </Route>
                <Route path="/pets" element={<PetsLayout></PetsLayout>}>
                    <Route index element={<Pets></Pets>}></Route>
                    <Route path=":id" element={<PetInfo></PetInfo>}></Route>
                    <Route path="update/:id" element={<PetUpdate></PetUpdate>}></Route>
                </Route>
                <Route path="/users" element={<UsersLayout></UsersLayout>}>
                    <Route index element={<User></User>}></Route>
                    <Route path=":public_id" element={<UserInfo/>}></Route>
                </Route>
                <Route element={<AuthLayout></AuthLayout>}>
                    <Route path="/notifications" element={<NotificationLayout></NotificationLayout>}>
                        <Route index element={<Notification></Notification>}></Route>
                    </Route>
                    <Route path="/messages" element={<MessageLayout></MessageLayout>}>
                        <Route
                            index
                            element={<AvailableConvo />}
                            loader={({ request }) => {
                                const url = new URL(request.url);
                                const name = url.searchParams.get("name");

                                return name
                                ? getService(`conversation?name=${encodeURIComponent(name)}`)
                                : getService("conversation");
                            }}/>
                    </Route>
                    <Route element={<SettingLayout></SettingLayout>}>
                        <Route path="setting" element={<Setting></Setting>}>
                            <Route path="blocked_users" element={<BlockedUsers></BlockedUsers>}></Route>
                            <Route path="change_password" element={<ChangePassword></ChangePassword>}></Route>
                            <Route path="history" element={<History></History>}></Route>
                            <Route path="request_forms" element={<RequestForms></RequestForms>}></Route>
                            <Route path="concern" element={<SendConcern></SendConcern>}></Route>
                            <Route index element={<PersonalInfo></PersonalInfo>}></Route>
                            <Route path="transactions" element={<Transaction></Transaction>}></Route>
                            <Route path="pets" element={<UserPets></UserPets>}></Route>
                        </Route>
                    </Route>

                    <Route path="request_forms/:id" element={<RequestForm/>} loader={({ params }) => getService(`forms/${params.id}`)}  errorElement={<PageError />}></Route>
                    <Route path="transaction/:id" element={<TransactionForm />} loader={({ params}) => getService(`transaction/${params.id}`)} errorElement={<PageError/>}></Route>
                    <Route path="history/:id" element={<HistoryForm/>}></Route>
                </Route>
            </Route>
            <Route element={<AdminLayoutAuth/>}>
                <Route path="/admin" element={<AdminDashboardLayout />}>
                    <Route index element={<AdminHome/>}></Route>
                    <Route path="pets" element={<AdminPets/>}></Route>
                    <Route path="pets/:id" element={<AdminPet/>}></Route>
                    <Route path="users" element={<AdminUsers />}></Route>
                    <Route path="users/:id" element={<AdminUser />}></Route>
                    <Route path="notifications" element={<AdminNotification/>}></Route>
                    <Route path="feedbacks" element={<AdminFeedback/>}></Route>
                    <Route path="reports" element={<AdminReport/>}></Route>
                    <Route path="restriction" element={<AdminBanSuspend/>}></Route>
                    <Route path="map" element={<AdminMap/>}></Route>
                </Route>
                <Route path="/admin/setting" element={<AdminSettingLayout></AdminSettingLayout>}>
                    <Route index element={<AdminSetting />}></Route>
                    <Route path="change_password" element={<AdminChangePass></AdminChangePass>}></Route>
                    <Route path="admins" element={<Admins/>}></Route>
                </Route>
            </Route>
        </>
    ))

export default MyRouter