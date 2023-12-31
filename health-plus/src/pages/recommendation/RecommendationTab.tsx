import { 
  IonContent, 
  IonHeader, 
  IonPage, 
  IonTitle, 
  IonToolbar, 
  IonCard, 
  IonCardHeader, 
  IonCardTitle, 
  IonCardSubtitle, 
  IonCardContent, 
  useIonViewWillEnter,
} from '@ionic/react';
import ExploreContainer from '../../components/ExploreContainer';
import './RecommendationTab.css';
import Header from '../../components/Header';
import { HealthKit, HealthKitOptions } from '@awesome-cordova-plugins/health-kit';
import { useEffect, useState } from 'react';
import { instance } from '../../utils';
import { useHistory } from 'react-router-dom';
import LoginFilter from '../../filter/LoginFilter';

const types = [
  'HKQuantityTypeIdentifierHeight',
  'HKQuantityTypeIdentifierActiveEnergyBurned',
];
const options: HealthKitOptions = {
  readTypes: types,
  writeTypes: types
};


const requestAuthorization = async () => {
  // Need to run this before any healthkit stuff
  if (!(await HealthKit.available())) {
    console.log("HealthKit is not available on this app.");
    return false;
  }
  for (const type of types) {
    const authRes = await HealthKit.checkAuthStatus({ 'type': type });
    if (authRes !== 'authorized') {
      await HealthKit.requestAuthorization(options);
      // Will request everything
      // Unfortunately this function returns null even if it suceeds  -_-
      break;
    }
  }
  console.log("Good to go I think");
  return true;
}


const getHealthData = async () => {
  // Returns the health data needed from HealthKit to recommend a meal.
  const res = await requestAuthorization();
  if (res === false) { return; }
  const height = await HealthKit.readHeight({ "unit": "in" });
  const gender = await HealthKit.readGender();
  console.log("The Gender: ", gender);
  const dob = (await HealthKit.readDateOfBirth()).substring(0, 10);
  console.log("Date of Birth: ", dob);
  const activeCal = await HealthKit.querySampleType({
    'startDate': new Date(new Date().getTime() - (24 * 60 * 60 * 1000)),
    'endDate': new Date(), // now
    'sampleType': 'HKQuantityTypeIdentifierActiveEnergyBurned',
    'unit': 'Cal'
  });
  let total_cal = 0;
  for (const calorie_obj of activeCal) {
    total_cal += calorie_obj?.quantity;
  }
  console.log({
    gender: gender,
    dob: dob,
    total_cal: total_cal,
    height: height.value
  });
  return {
    gender: gender,
    dob: dob,
    total_cal: total_cal,
    height: height.value
  };
}


const RecommendationTab: React.FC = () => {
  const history = useHistory();
  const [mealData, setData] = useState([{
    id: '',
    meal_name: '',
    calories: 0,
    total_fat: 0,
    carbohydrates: 0,
    protein: 0,
    image_url: '',
    meal_description: '',
  }]);
  useIonViewWillEnter(async () => {
    const healthkitAuthorized = await requestAuthorization();
    if (healthkitAuthorized) {
      const healthData = await getHealthData();
      const headers = {
        Authorization: "Bearer " + localStorage.getItem("token")
      };
      const response = await instance.post('/meals/recommended', healthData, { headers });
      console.log(response.data);
      if (response?.data?.length == 0) { response.data = []; }
      setData(response.data); // So when post is empty, no cards show up instead of the default one
    } else {
      setData([]);
    }
  });

  const emptyMessage = (mealData: Array<object>) => {
    if (mealData.length == 0) { return "No meals to show!"; }
    return "";
  };

  const redirect = (id: string) => {
    history.push({
      pathname: `meal/${id}`,
      state: { detail: 'recommendations' }
    })
  }


  // TODO: Get ID !!!!!
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          {emptyMessage(mealData)}
          <Header />
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        {mealData.map(recipe => {
          return (
            <>
              <IonCard key={recipe.id} onClick={() => { redirect(recipe.id); }}>
                <img width="20%" alt="Recipe" src={recipe.image_url} />
                <IonCardTitle text-wrap>{recipe.meal_name}</IonCardTitle>
                <IonCardHeader>
                  <IonCardSubtitle>Calories: {recipe.calories}, Protein: {recipe.protein}, Carbohydrates: {recipe.carbohydrates}, Fats: {recipe.total_fat}</IonCardSubtitle>
                </IonCardHeader>
                <IonCardContent>
                  {recipe.meal_description}
                </IonCardContent>
              </IonCard>
            </>
          )
        })}
      </IonContent>
    </IonPage>
  );
};

export default LoginFilter(RecommendationTab);
