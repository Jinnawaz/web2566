const RB = ReactBootstrap;
const { Alert, Card, Button, Table } = ReactBootstrap;
const firebaseConfig = {
    apiKey: "AIzaSyCnII6PNv_RRWuXrFNlU6e4zAoiDxBhifU",
            authDomain: "web2566-f6d6b.firebaseapp.com",
            projectId: "web2566-f6d6b",
            storageBucket: "web2566-f6d6b.appspot.com",
            messagingSenderId: "303233060563",
            appId: "1:303233060563:web:39bdf9e2c71b51918e4e26",
            measurementId: "G-XYH4NWJ94T"
};
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
db.collection("students").get().then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
        console.log(`${doc.id} =>`, doc.data());
    });
});


class App extends React.Component {
    data() {
        return {
          title: "Work 6:  เรียกใช้ฐานข้อมูล Firebase ด้วย VueJS",
          footer: "ระบุ รหัส ชื่อ-สกุล สาขา",
          students: [],
          editstd: {},
          editmode: 0,
          user: null,
          ustudent: null,
        };
      }
      getstudent(email){
        db.collection("students")
          .where("email","==",email)
          .limit(1)
          .get()
          .then(
            (querySnapshot) => {
             querySnapshot.forEach((doc) => {
              this.ustudent = { id: doc.id, ...doc.data() };
            });
           }
        );
      }

    mounted() {
        firebase.auth().onAuthStateChanged((user)=>{
           if (user) {
             this.user = user.toJSON();
           }else{
             this.user = null;
          }
        });
    }
    google_login() {
        // Using a popup.
        var provider = new firebase.auth.GoogleAuthProvider();
        provider.addScope("profile");
        provider.addScope("email");
        firebase.auth().signInWithPopup(provider);
      }
      google_logout(){
        if(confirm("Are you sure?")){
          firebase.auth().signOut();
        }
      }

    render() {
        var stext = JSON.stringify(this.state.students);
        return (
            <Card>
                <Card.Header>{this.title}</Card.Header>
                <Card.Body>
                    <Button onClick={() => this.readData()}>Read Data</Button>
                    <Button onClick={() => this.autoRead()}>Auto Read</Button>

                    <div>
                        {stext}
                    </div>
                </Card.Body>
                <Card.Footer>{this.footer}</Card.Footer>
            </Card>
        );
    }
    delete(std){
        if(confirm("ต้องการลบข้อมูล")){
           db.collection("students").doc(std.id).delete();
        }
    }


    autoRead() {
        db.collection("students").onSnapshot((querySnapshot) => {
            var stdlist = [];
            querySnapshot.forEach((doc) => {
                stdlist.push({ id: doc.id, ...doc.data() });
            });
            this.setState({ students: stdlist });
        });
    }

    readData() {
        db.collection("students").get().then((querySnapshot) => {
            var stdlist = [];
            querySnapshot.forEach((doc) => {
                stdlist.push({ id: doc.id, ...doc.data() });
            });
            console.log(stdlist);
            this.setState({ students: stdlist });
        });
    }
    edit(std){      
        this.setState({
         stdid    : std.id,
         stdtitle : std.title,
         stdfname : std.fname,
         stdlname : std.lname,
         stdemail : std.email,
         stdphone : std.phone,
        })
     }
 


    title = (
        <Alert variant="info">
            <b>Work6 :</b> Firebase
        </Alert>
    );
    footer = (
        <div>
            By 643020596-9 Jinnawat Sopa <br />
            College of Computing, Khon Kaen University
        </div>
    );
    state = {
        scene: 0,
        students:[],
        stdid:"",
        stdtitle:"",
        stdfname:"",
        stdlname:"",
        stdemail:"",
        stdphone:"",
    }


    render() {
        // var stext = JSON.stringify(this.state.students);  
        return (
          <Card>
            <Card.Header>{this.title}</Card.Header>  
            <Card.Body>
              <Button onClick={()=>this.readData()}>Read Data</Button>
              <Button onClick={()=>this.autoRead()}>Auto Read</Button>
              <div>
              <StudentTable data={this.state.students} app={this}/>  
              </div>
            </Card.Body>
            <Card.Footer>
            <b>เพิ่ม/แก้ไขข้อมูล นักศึกษา :</b><br/>
            <TextInput label="ID" app={this} value="stdid" style={{width:120}}/>  
            <TextInput label="คำนำหน้า" app={this} value="stdtitle" style={{width:100}} />
            <TextInput label="ชื่อ" app={this} value="stdfname" style={{width:120}}/>
            <TextInput label="สกุล" app={this} value="stdlname" style={{width:120}}/>
            <TextInput label="Email" app={this} value="stdemail" style={{width:150}} />        
            <TextInput label="Phone" app={this} value="stdphone" style={{width:120}}/>
            <Button onClick={()=>this.insertData()}>Save</Button>
            </Card.Footer>
            <Card.Footer>{this.footer}</Card.Footer>
          </Card>          
        );
      }

  insertData(){
        db.collection("students").doc(this.state.stdid).set({
           title : this.state.stdtitle,
           fname : this.state.stdfname,
           lname : this.state.stdlname,
           phone : this.state.stdphone,
           email : this.state.stdemail,
        });
    }

}
function DeleteButton({std,app}){    
    return <button onClick={()=>app.delete(std)}>ลบ</button>
  }

function EditButton({std,app}){
    return <button onClick={()=>app.edit(std)}>แก้ไข</button>
   }
 
   function StudentTable({data, app}){
    return <table className='table'>
    <tr>
        <td>รหัส</td>
        <td>คำนำหน้า</td>
        <td>ชื่อ</td>
        <td>สกุล</td>
        <td>email</td>
        </tr>
        {
          data.map((s)=><tr>
          <td>{s.id}</td>
          <td>{s.title}</td>
          <td>{s.fname}</td>
          <td>{s.lname}</td>
          <td>{s.email}</td>
          <td><EditButton std={s} app={app}/></td>
          <td><DeleteButton std={s} app={app}/></td>        
          </tr> )
        }
    </table>
  }


  function TextInput({label,app,value,style}){
    return <label className="form-label">
    {label}:    
     <input className="form-control" style={style}
     value={app.state[value]} onChange={(ev)=>{
         var s={};
         s[value]=ev.target.value;
         app.setState(s)}
     }></input>
   </label>;  
  }


const container = document.getElementById("myapp");
const root = ReactDOM.createRoot(container);
root.render(<App />);
