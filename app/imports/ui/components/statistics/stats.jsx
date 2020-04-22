import React, { PureComponent } from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import {
  PieChart, Pie, Legend, Tooltip, Cell
} from 'recharts';

class Example extends PureComponent {
  render() {
    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
    const dataInfraWP = [
      { name: 'Sites dans l\'infra WordPress', value: this.props.nbSitesInfra }, 
      { name: 'Sites en dehors de l\'infra', value: this.props.nbSitesNoInfra },
    ];
    const dataThemes = [
      { name: 'wp-theme-2018', value: this.props.nbSitesByTheme2018 },
      { name: 'wp-theme-light', value: this.props.nbSitesByThemeLight },
      { name: 'epfl-blank', value: this.props.nbSitesByEpflBlank },
      { name: 'epfl-master', value: this.props.nbSitesByEpflMaster },
      
    ];
    return (
      <div>
        <div style={ { "marginTop": "20px"} }>
          <h4>Nombre de sites avec le thème light </h4>
          <PieChart width={300} height={300}>
            <Pie 
              dataKey="value" 
              isAnimationActive={true} 
              data={dataThemes} cx={150} cy={100} outerRadius={80} fill="#8884d8" label>
              {
                dataThemes.map((entry, index) => <Cell key={index} fill={COLORS[index % COLORS.length]}/>)
              }
            </Pie>
            <Tooltip />
          </PieChart>
        </div>
        <div style={ { "marginTop": "20px"} }>
          <h4>Nombre de sites présent ou non dans l'infrastructure WordPress géré par la VPSI</h4>
          <PieChart width={300} height={300}>
            <Pie 
              dataKey="value" 
              isAnimationActive={true} 
              data={dataInfraWP} cx={150} cy={100} outerRadius={80} fill="#8884d8" label>
              {
                dataInfraWP.map((entry, index) => <Cell key={index} fill={COLORS[index % COLORS.length]}/>)
              }
            </Pie>
            <Tooltip />
          </PieChart>
        </div>
      </div>
    );
  }
}
export default withTracker((props) => {

  Meteor.subscribe('sites.list');

  let nbSitesInfra = Sites.find({wpInfra: true}).count();
  let nbSitesNoInfra = Sites.find({wpInfra: false}).count();

  let nbSitesByTheme2018 = Sites.find({theme: 'wp-theme-2018'}).count();
  let nbSitesByThemeLight = Sites.find({theme: 'wp-theme-light'}).count();
  let nbSitesByEpflBlank = Sites.find({theme: 'epfl-blank'}).count();
  let nbSitesByEpflMaster = Sites.find({theme: 'epfl-master'}).count();


  console.log(nbSitesInfra);

  return {
    nbSitesInfra: nbSitesInfra,
    nbSitesNoInfra: nbSitesNoInfra,
    
    nbSitesByTheme2018: nbSitesByTheme2018,
    nbSitesByThemeLight: nbSitesByThemeLight,
    nbSitesByEpflBlank: nbSitesByEpflBlank,
    nbSitesByEpflMaster: nbSitesByEpflMaster,
  };
  
})(Example);