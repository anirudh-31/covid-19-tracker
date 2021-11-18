import "./App.css";
import {
  FormControl,
  MenuItem,
  Select,
  Card,
  CardContent,
} from "@mui/material";
import { useState, useEffect } from "react";
import Table from "./Table";
import Infobox from "./Infobox";
import Map from "./Map";
import LineGraph from "./LineGraph";
import { sortData, prettyPrintStat } from "./util";
import "leaflet/dist/leaflet.css";

function App() {
  const [Countries, setCountries] = useState([]);
  const [Country, setCountry] = useState("worldwide");
  const [countryInfo, setcountryInfo] = useState({});
  const [tableData, settableData] = useState([]);
  const [MapCenter, setMapCenter] = useState({ lat: 34.8076, lng: -40.4796 });
  const [MapCountries, setMapCountries] = useState([]);
  const [MapZoom, setMapZoom] = useState(3);
  const [casesType, setcasesType] = useState("cases");

  useEffect(() => {
    fetch("https://disease.sh/v3/covid-19/all")
      .then((res) => res.json())
      .then((data) => setcountryInfo(data));
  }, []);

  useEffect(() => {
    const getCountriesData = async () => {
      await fetch("https://disease.sh/v3/covid-19/countries")
        .then((response) => response.json())
        .then((data) => {
          const Countries = data.map((country) => ({
            name: country.country,
            value: country.countryInfo.iso2,
          }));
          const sortedData = sortData(data);
          settableData(sortedData);
          setMapCountries(data);
          setCountries(Countries);
        });
    };
    getCountriesData();
  }, []);

  const onCountryChange = async (e) => {
    const countryCode = e.target.value;
    const url =
      countryCode === "worldwide"
        ? `https://disease.sh/v3/covid-19/all`
        : `https://disease.sh/v3/covid-19/countries/${countryCode}`;

    await fetch(url)
      .then((res) => res.json())
      .then((data) => {
        setCountry(countryCode);
        setcountryInfo(data);
        setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
        setMapZoom(4);
      });
  };

  return (
    <div className="app">
      <div className="app__left">
        {/* Header */}
        <div className="app__header">
          <h1>COVID-19 TRACKER</h1>
          <FormControl className="app__dropdown">
            <Select
              variant="outlined"
              value={Country}
              onChange={onCountryChange}
            >
              <MenuItem value="worldwide">Worldwide</MenuItem>
              {Countries.map((country) => (
                <MenuItem value={country.value}>{country.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
        <div className="app__stats">
          {/* InfoBox --> total Cases */}
          <Infobox
            isRed
            active={casesType === "cases"}
            onClick={(e) => setcasesType("cases")}
            title="Coronavirus cases"
            cases={prettyPrintStat(countryInfo.todayCases)}
            total={prettyPrintStat(countryInfo.cases)}
          />
          {/* InfoBox --> Recovered*/}
          <Infobox
            active={casesType === "recovered"}
            onClick={(e) => setcasesType("recovered")}
            title="Recovered"
            cases={prettyPrintStat(countryInfo.todayRecovered)}
            total={prettyPrintStat(countryInfo.recovered)}
          />
          {/* InfoBox --> Deaths*/}
          <Infobox
            isRed
            active={casesType === "deaths"}
            onClick={(e) => setcasesType("deaths")}
            title="Deaths"
            cases={prettyPrintStat(countryInfo.todayDeaths)}
            total={prettyPrintStat(countryInfo.deaths)}
          />
        </div>
        {/* Map */}
        <Map
          countries={MapCountries}
          center={MapCenter}
          zoom={MapZoom}
          casesType={casesType}
        />
      </div>
      <Card className="app__right">
        <CardContent>
          <h3>Live Cases By Country</h3>
          <Table countries={tableData} />
          {/* Table */}
          <h3 className="app__graphTitle">Worldwide new {casesType}</h3>
          {/* Graph */}
          <LineGraph className="app__graph" casesType={casesType} />
        </CardContent>
      </Card>
    </div>
  );
}

export default App;
