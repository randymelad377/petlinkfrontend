import { useState } from "react";
import { FaChevronDown } from "react-icons/fa";
import Style from "./SearchBar.module.css";
import { useLocation, useNavigate } from "react-router-dom";

function SearchBar({ search,
    setSearch,
    status,
    setStatus,
    searchUser,
    setSearchUser }) {

    const navigate = useNavigate();
    const location = useLocation().pathname;
    //FOR SETTING LOCATION
    const showSearchSetting = location === "/pets" || location === "/admin/pets";
    
    //FOR SEARCH BY
    const [showSearchBy, setShowSearchBy] = useState(false);
    const [type, setType] = useState("");
    const toggleShowSearchBy = (type) => {
        setShowSearchBy(prev => !prev);
        setType(type);
    }

    //FOR STATUS
    const [showStatus, setShowStatus] = useState(false);
    const toggleStatus = (status) => {
        setShowStatus(prev => !prev);
        setStatus(status)
    }   

    //INPUT VALUE
    const [searchInput, setSearchInput] = useState();
    const toggleSearch = () => {
        if (location === "/pets") {
            const newValue = searchInput && type ? `${type}=${searchInput}` : "";
            setSearch(newValue)
        } else if (location === "/messages") {

            const newValue = searchInput ? `name=${searchInput}` : "";
            setSearch(newValue);
            if (newValue !== "") {
                navigate(`/messages?${newValue}`)
            } else {
                navigate(`/messages`)
            }
        } else if (location === "/admin/users") {
            const newValue = searchInput ? `name=${searchInput}` : "";
            setSearchUser(newValue);
        } else {
            const newValue = searchInput ? `name=${searchInput}` : "";
            setSearchUser(newValue);
        }
    }

    return (
        <section className={Style.searhBarOuterContainer}>
            <div className={Style.searchBarContainer}>
                <input type="text" onChange={(e) => {setSearchInput(e.target.value)}} className={Style.searchInput} placeholder="Search" />
            </div>
            {
                location === "/admin/users" && (<div className={Style.dropDownContainer}>
                        <div className={Style.toggleDd} onClick={() => setShowStatus(prev => !prev)}><span>{status}</span> <FaChevronDown></FaChevronDown></div>
                            {
                                showStatus && (
                                    <ol className={Style.dd}>
                                <li onClick={() => { toggleStatus("active"); }}>active</li>
                                        <li onClick={() => {toggleStatus("suspend");}}>suspended</li>
                                        <li onClick={() => {toggleStatus("banned");}}>banned</li>
                                    </ol>
                                )
                            }
                    </div>)
            }
            {
                showSearchSetting && (
                    <>
                        <div className={Style.dropDownContainer}>
                            <div className={Style.toggleDd} onClick={() => setShowSearchBy(prev => !prev)}><span>{type || "Search By"}</span> <FaChevronDown></FaChevronDown></div>
                                {
                                    showSearchBy && (
                                        <ol className={Style.dd}>
                                            <li onClick={() => toggleShowSearchBy('species')}>species</li>
                                            <li onClick={() => toggleShowSearchBy('breed')}>breed</li>
                                            <li onClick={() => toggleShowSearchBy('color')}>color</li>
                                            <li onClick={() => toggleShowSearchBy('gender')}>gender</li>
                                        </ol>
                                    )
                                }
                        </div>
                        
                        <div className={Style.dropDownContainer}>
                            <div className={Style.toggleDd} onClick={()=>setShowStatus(prev => !prev)}><span>{status?.split("=")?.[1] || "Search By"}</span> <FaChevronDown></FaChevronDown></div>
                            {
                                showStatus && (
                                    <ol className={Style.dd}>
                                        <li onClick={() => toggleStatus(`status=rehome`)}>For Rehoming</li>
                                        <li onClick={() => toggleStatus(`status=found`)}>Found Pet</li>
                                        <li onClick={() => toggleStatus(`status=missing`)}>Missing Pet</li>
                                        {location.includes("admin") && (
                                            <>
                                                <li onClick={() => toggleStatus(`status=pending`)}>Pending</li>
                                                <li onClick={() => toggleStatus(`status=verified`)}>Verified</li>
                                                <li onClick={() => toggleStatus(`status=inTransaction`)}>In Transaction</li>
                                                <li onClick={() => toggleStatus(`status=softDeleted`)}>Soft Deleted</li>
                                            </>
                                        )}
                                    </ol>
                                )
                            }
                        </div>
                    </>
                )
            }
            <button className={Style.search} onClick={toggleSearch}>Search</button>
        </section>
    )

}

                                                
export default SearchBar