import React, { useState, useEffect } from 'react';
import inboxDataList from './inbox.json';
import spamDataList from './spam.json';
import styles from "./app.scss";
import search from "./zoom.png";
import plus from "./interface.png";
import mail from "./note.png";
import up from "./up.png";
import down from "./down.png";
import flag from "./flag.png";
import flagged from "./flagged.png"
import deleteIcon from "./delete.png"
import square from "./square.png"

function App() {
  /**
  * Parse the Array 
  * @param {mailArray} parse the data according to requirement
  */
  const mailArray = [
    { 'type': 'Inbox', 'mails': inboxDataList },
    { 'type': 'Spam', 'mails': spamDataList },
    { 'type': 'Deleted Items', 'mails': [] },
    { 'type': 'Custom Folder', 'mails': [] }
  ]
  const [deletedItems, setDeletedItems] = useState([]);
  const [listItems, setListItems] = useState(true)
  const [tabs, setTabs] = useState('focusTab')
  const [activeMail, setActiveMail] = useState()
  const [content, setContent] = useState()
  const [filter, setFilter] = useState(false)
  const [filterChange, setFilterChange] = useState('All');
  const [defaultInbox, setDefaultInbox] = useState([]);
  const [mailsList, setMailsList] = useState([]);

  const list = ['Inbox', 'Spam', 'Deleted Items', 'Custom Folder']
  const [selectedFolder, setSelectedFolder] = React.useState(list[0])

  /**
   * @param {function} toggleList toggle list of items
   */
  const toggleList = () => {
    setListItems(!listItems);
  }

  /**
   * @param {string} name selected unique subject
  * @param {function} selectFolder select the folders(inbox/spam....)
  */

  const selectFolder = (name) => {
    setSelectedFolder(name);
    if (name === 'Deleted Items') {
      setMailsList(deletedItems)
    } else {
      mailArray.forEach(ele => {
        if (name === ele.type) {
          setMailsList(ele.mails);
          setDefaultInbox(ele.mails);
        }
      })
    }
  }
  /**
   * @param {string} id based on the id set the brief content of individual mail
  * @param {function} selectedMail set the active selected mail
  */
  const selectedMail = (id) => {
    mailsList.forEach(ele => {
      if (ele.mId === id) {
        setContent(ele.content)
        setActiveMail(ele.mId)
      }
    })
  }

  /**
   * @param {string} id unique id to delete mail
  * @param {function} deleteMail delete the selected mail from the list
  */
  const deleteMail = (id) => {
    if (selectedFolder != 'Deleted Items') {
      var data = [];
      var delData = []
      mailsList.forEach((ele, i) => {
        if (ele.mId != id) {
          data.push(ele)
        } else {
          delData.push(ele)
          setDeletedItems(deletedItems.concat(delData))
        }
      })
      setMailsList(data)
    } else {
      if (deletedItems.length > 0) {
        deletedItems.forEach((d, j) => {
          if (d.mId === id) {
            deletedItems.splice(j, 1)
          }
        })
        setDeletedItems([...deletedItems]);
      }
    }
  }
  console.log(deletedItems);
  /**
   * @param {string} id unique id to flag mail
  * @param {function} flagMail set/unset the flag based on the selected email 
  */
  const flagMail = (id) => {
    var data = [];
    mailsList.forEach(ele => {
      if (ele.mId === id) {
        ele.flag = !ele.flag;
      }
      data.push(ele)
    })
    setMailsList(data);
  }
  /**
    * @param {function} filterData Filter data based on Unread, All and Flagged
    */
  const filterData = (event) => {
    setFilterChange(event.target.innerHTML)
    if (event.target.innerHTML === 'Unread') {
      var x = [];
      defaultInbox.forEach(ele => {
        if (ele.unread === true) {
          x.push(ele);
        }
      })
      setMailsList(x);
    } else if (event.target.innerHTML === 'Flagged') {
      var xx = [];
      defaultInbox.forEach(ele => {
        if (ele.flag === true) {
          xx.push(ele);
        }
      })
      setMailsList(xx);
    } else {
      setMailsList(defaultInbox)
    }
    setFilter(false);
  }

  useEffect(() => {
    if (mailsList.length > 0) {
      setActiveMail(mailsList[0].mId)
      setContent(mailsList[0].content)
    } else {
      setActiveMail('')
      setContent('')
    }
  }, [mailsList])

  useEffect(() => {
    setDefaultInbox(mailArray[0].mails)
    setMailsList(mailArray[0].mails)
  }, [])

  useEffect(() => {
    if (deletedItems.length > 0) {
      mailArray.forEach(ele => {
        ele.mails.forEach((o, j) => {
          deletedItems.forEach(d => {
            if (d.mId === o.mId) {
              ele.mails.splice(j, 1)
            }
          })
        })
      })
    }
  }, [deletedItems])
  return (
    <div className="MainSection">
      <div className="outlook"><span className="mailIcon"><img src={square}></img></span>Outlook Mail</div>
      <header>
        <div className="search">
          <div className="searchText">Search Mail and People <img src={search}></img></div>
        </div>
        <div className="addNew">
          <div className="new"> <img src={plus}></img> New</div>
          <div><img src={mail}></img> Mark all as read</div>
        </div>
      </header>
      <section>
        <div className="folderSection">
          <div onClick={() => toggleList()} className="folderText"> <img src={listItems ? up : down}></img> Folders</div>
          <ul style={{ 'display': listItems ? 'block' : 'none', 'maxHeight': listItems ? '500px' : '0' }}>
            {
              list.map((obj, i) => (
                <li className={selectedFolder === obj ? 'activeClass' : ''} key={i} onClick={() => selectFolder(obj)}>{obj}</li>
              ))
            }

          </ul>
        </div>
        <div className="focusedSection">
          <div className="tabs">
            <button style={{ color: tabs === 'focusTab' ? 'blue' : 'black' }} onClick={() => setTabs('focusTab')} className="focusTab">Focused</button>
            <button style={{ color: tabs === 'otherTab' ? 'blue' : 'black' }} onClick={() => setTabs('otherTab')} className="otherTab">Others</button>
            <button onClick={() => setFilter(!filter)} className="filter"> <img src={down}></img> Filter</button>
            <ul onClick={(e) => filterData(e)} className="filterDisplay" style={{ 'display': filter ? 'block' : 'none' }}>
              <li className={filterChange === 'All' ? 'activeFilter' : ''}>All</li>
              <li className={filterChange === 'Unread' ? 'activeFilter' : ''}>Unread</li>
              <li className={filterChange === 'Flagged' ? 'activeFilter' : ''}>Flagged</li>
            </ul>
          </div>
          {tabs === 'focusTab' ?
            mailsList.map((e, i) => (
              <div style={{ 'background': e.flag && e.flag ? '#ff080824' : '' }} className={`${"focusedInboxList"} ${activeMail === e.mId ? "activeClass" : ''}`} key={i}>
                <div onClick={() => selectedMail(e.mId)}>
                  <div>Outlook Team</div>
                  <div> {e.mId}</div>
                  <div className="subject">{e.subject}</div>
                  <div className="timestamp">{e.time}...</div>
                </div>
                <div className="actionIcons">
                  <span onClick={() => deleteMail(e.mId)}><img src={deleteIcon} style={{ 'marginRight': '5px' }} ></img></span>
                  <span onClick={() => flagMail(e.mId)}><img src={e.flag && e.flag ? flagged : flag}></img></span>
                </div>
              </div>
            ))
            :
            <div>
              {/* <div>Others team</div> */}
            </div>
          }
        </div>
        <div className="contentSection">
          <span className="useIcon">G1</span>
          <span className="selectedMail">
            <div> {'User Name'} </div>
            <div>{'name@outlook.com'}</div>
          </span>
          <div className="content"> {content}</div>
        </div>
      </section >
    </div >
  );
}

export default App;
