import {
    IonContent,
    IonHeader,
    IonPage,
    IonTitle,
    IonToolbar,
    IonRow,
    IonCol,
    IonItem,
    IonText,
    IonButton,
    IonLabel,
    IonInput,
    IonSelect,
    IonSelectOption,
  } from "@ionic/react";
  import './InfoPage.css'
  
  const InfoPage: React.FC = () => {
    return (
      <IonPage>
        <IonHeader>
            <IonToolbar>
            <IonTitle class="ion-text-center">Health +</IonTitle>
            </IonToolbar>
        </IonHeader>
        <IonContent fullscreen>
        <IonText class = "ion-text-center"><h1>Before we start, let's get some info!</h1></IonText>
          {/* <IonText><h4 className="height-text">Height</h4></IonText>
          <IonItem lines="full">
            <IonLabel>Feet</IonLabel>
            <IonInput type="number" required></IonInput>
          </IonItem>
          <IonItem lines="full">
            <IonLabel>Inches</IonLabel>
            <IonInput type="number" required></IonInput>
          </IonItem>
          <IonItem className="sex-component" lines="full">
            <IonLabel>Sex</IonLabel>
            <IonSelect>
                <IonSelectOption>
                    Male
                </IonSelectOption>
                <IonSelectOption>
                    Female
                </IonSelectOption>
                <IonSelectOption>
                    Non-binary
                </IonSelectOption>
            </IonSelect>
          </IonItem> */}
          <IonItem className="fitness-goal-component" lines="full">
            <IonLabel>What is your goal? (This can be changed at anytime)</IonLabel>
            <IonSelect>
                <IonSelectOption>
                    Lose Weight
                </IonSelectOption>
                <IonSelectOption>
                    Gain Weight/Muscle
                </IonSelectOption>
                <IonSelectOption>
                    Maintain Weight
                </IonSelectOption>
            </IonSelect>
          </IonItem>
          <IonRow>
            <IonCol>
              <IonButton type="submit" color="danger" expand="block">
                Next
              </IonButton>
            </IonCol>
          </IonRow>
        </IonContent>
      </IonPage>
    );
  };
  
  export default InfoPage;
  