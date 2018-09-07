import React, { Component } from 'react';
import { Input, Button } from 'antd';
import './App.css';
import Plot from 'react-plotly.js';


import worker from 'workerize-loader!./worker'; // eslint-disable-line


class App extends Component {
  state = {
    start: '1',
    end: '4',
    degree: '3',
    precision: '0.001',
    func: 'sin(x)',
    x: [],
    y: []
  }

  constructor() {
    super()

    
  }

  render() {
    const {start, end, degree, precision, func} = this.state;
    return (
      <div className="App">
        minmax
        <Input placeholder="Start" value={start} onChange={e => this.setState({start: +e.target.value})} />
        <Input placeholder="End" value={end} onChange={e => this.setState({end: +e.target.value})} />
        <Input placeholder="Degree" value={degree} onChange={e => this.setState({degree: +e.target.value})} />
        <Input placeholder="Precision" value={precision} onChange={e => this.setState({precision: +e.target.value})} />
        <Input placeholder="Function" value={func} onChange={e => this.setState({func: e.target.value})} />
        <Button type="dashed" onClick={() => {

          this.setState({x: [], y: []})
          this.instance = worker()  // `new` is optional

          this.instance.onmessage = ({data}) => {
            let iterationData;
            try {
              iterationData = JSON.parse(data)
                          
              const x = (this.state.x[this.state.x.length - 1] || 0) + 1
              const y = Math.abs(iterationData.maxError)
              this.setState({
                x: [...this.state.x, x],
                y: [...this.state.y, y]
              })
            } catch (err) {
              console.log(err)
            }

          }
          this.instance.postMessage({start: +start, end: +end, degree: +degree, precision: +precision, func})
        }}>Calculate</Button>
        <Button onClick={() => this.setState({x: [...this.state.x, this.state.x[this.state.x.length - 1] + 1], y: [...this.state.y, Math.random() * 10]})}>Add random point</Button>
        <Plot
          data={[
            {
              x: this.state.x,
              y: this.state.y,
              type: 'scatter',
              mode: 'lines+points',
              marker: {color: 'red'},
            },
            {type: 'bar', x: this.state.x, y: this.state.y},
          ]}
          layout={ {width: 600, height: 400, title: 'A Fancy Plot'} }
        />
      </div>
    );
  }
}

export default App;
