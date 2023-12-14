import React from 'react';

export default (props) => (
  <>
    <div className="form-group">
      <label htmlFor="name" {...props.label('name')}>
        Name
      </label>
      <input
        className="form-control"
        {...props.text('name')}
        id="name"
        required
        minLength="5"
        aria-describedby="nameHelp"
        placeholder="Name"
        autoFocus
      />
      <small id="nameHelp" className="form-text text-muted">
        Please, give me a beautiful name.
      </small>
    </div>
    <div className="form-group">
      <label htmlFor="link" {...props.label('link')}>
        Link
      </label>
      <input
        className="form-control"
        id="link"
        {...props.text('link')}
        minLength="5"
        placeholder="Link"
      />
    </div>
    <div className="form-group">
      <label htmlFor="smalldescription" {...props.label('smalldescription')}>
        Small Description
      </label>
      <input
        className="form-control"
        id="smalldescription"
        required
        {...props.text('smalldescription')}
        minLength="10"
        maxLength="100"
        placeholder="Small Description"
      />
    </div>
    <div className="form-group">
      <label htmlFor="description" {...props.label('description')}>
        Description
      </label>
      <input
        className="form-control"
        id="description"
        required
        {...props.text('description')}
        minLength="10"
        placeholder="Description"
      />
    </div>
    <div className="form-group">
      <label htmlFor="location" {...props.label('location')}>
        Location
      </label>
      <input
        className="form-control"
        id="location"
        {...props.text('location')}
        required
        minLength="3"
      />
    </div>
    <div className="form-group">
      <label htmlFor="time" {...props.label('time')}>
        Time
      </label>
    </div>
    <div className="row">
      <div className="col">
        <input
          type="number"
          className="form-control"
          placeholder="Year"
          {...props.number('year')}
          minLength="4"
          maxLength="4"
          min="2021"
          required
        />
      </div>
      <div className="col">
        <input
          type="number"
          className="form-control"
          placeholder="Month"
          {...props.number('month')}
          minLength="1"
          maxLength="2"
          min="1"
          max="12"
          required
        />
      </div>
      <div className="col">
        <input
          type="number"
          className="form-control"
          placeholder="Day"
          {...props.number('day')}
          minLength="1"
          maxLength="2"
          min="1"
          max="31"
        />
      </div>
      <div className="col">
        <input
          type="number"
          className="form-control"
          placeholder="Hour"
          {...props.number('hour')}
          minLength="1"
          maxLength="2"
          min="0"
          max="23"
          required
        />
      </div>
      <div className="col">
        <input
          type="number"
          className="form-control"
          placeholder="Minute"
          {...props.number('minute')}
          minLength="1"
          maxLength="2"
          min="0"
          max="59"
          required
        />
      </div>
    </div>
    <div className="form-group">
      <label htmlFor="flags" {...props.label('flags')}>
        Flags
      </label>
    </div>
    <div className="row">
    <div className="col">
        <label htmlFor="questionsweight" {...props.label('questionsweight')}>
        questions weight
        </label>
        <input
          className="form-control"
          {...props.number('questionsweight')}
          id="questionsweight"
          type="number"
        />
      </div>
      <div className="col">
        <label htmlFor="addrestusers" {...props.label('addrestusers')}>
          add rest users
        </label>
        <input
          className="form-control"
          {...props.checkbox('addrestusers')}
          id="addrestusers"
          type="checkbox"
        />
      </div>
      <div className="col">
        <label htmlFor="recircle" {...props.label('recircle')}>
          re circle
        </label>
        <input
          className="form-control"
          {...props.checkbox('recircle')}
          id="recircle"
          type="checkbox"
        />
      </div>
      <div className="col">
        <label htmlFor="age" {...props.label('age')}>
          age
        </label>
        <input
          className="form-control"
          {...props.checkbox('age')}
          id="age"
          type="checkbox"
        />
      </div>
      <div className="col">
        <label htmlFor="circlesize" {...props.label('circlesize')}>
          circle size
        </label>
        <br />
        <select {...props.select('circlesize')}>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
          <option value="6">6</option>
          <option value="7">7</option>
          <option value="8">8</option>
          <option value="9">9</option>
          <option value="10">10</option>
        </select>
      </div>
      <div className="col">
        <label htmlFor="prematch" {...props.label('prematch')}>
          pre match
        </label>
        <input
          className="form-control"
          {...props.checkbox('prematch')}
          id="prematch"
          type="checkbox"
        />
      </div>
      <div className="col">
        <label htmlFor="lang" {...props.label('lang')}>
          lang
        </label>
        <input
          className="form-control"
          {...props.checkbox('lang')}
          id="lang"
          type="checkbox"
        />
      </div>
      <div className="col">
        <label htmlFor="notify" {...props.label('notify')}>
          notify
        </label>
        <input
          className="form-control"
          {...props.checkbox('notify')}
          id="notify"
          type="checkbox"
        />
      </div>
      <div className="col">
        <label htmlFor="type" {...props.label('type')}>
          type event
        </label>
        <br />
        <select {...props.select('type')}>
          <option value="0">Chat</option>
          <option value="1">Video</option>
        </select>
      </div>
    </div>
  </>
);
