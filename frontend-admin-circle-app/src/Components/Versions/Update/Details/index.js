import React, {useEffect, useContext} from 'react';
import {Link, withRouter} from 'react-router-dom';
import {useFormState} from 'react-use-form-state';
import {Context} from '../../../../Context';
import fetchGraphQL from '../../../../Api/fetchGraphQL';
import FormStyle from './style';

export default withRouter(({history}) => {
  const {state} = useContext(Context);
  let [formState, {label, text}] = useFormState();

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetchGraphQL(
        `{
          updatedVersion {
            androidbuild
            iosbuild
            androidbuildforced
            iosbuildforced
          }
        }`,
      );

      const {
        androidbuild,
        iosbuild,
        androidbuildforced,
        iosbuildforced,
      } = response.data.updatedVersion;

      formState.setField('androidbuild', androidbuild);
      formState.setField('iosbuild', iosbuild);
      formState.setField('androidbuildforced', androidbuildforced);
      formState.setField('iosbuildforced', iosbuildforced);
    };

    fetchData();
  }, [formState]);

  async function handleSubmit(e) {
    e.preventDefault();

    if (formState.errors.constructor === Object && checkNoErrors()) {
      const {
        androidbuild,
        iosbuild,
        androidbuildforced,
        iosbuildforced,
      } = formState.values;

      await fetchGraphQL(
        `mutation {
          updatedVersion(
            androidbuild: ${androidbuild}, 
            iosbuild: ${iosbuild},
            androidbuildforced: ${androidbuildforced},
            iosbuildforced: ${iosbuildforced} 
          ) 
        }`,
        '',
        state.token,
      );

      history.push('/versions');
    }
  }

  function checkNoErrors() {
    if (Object.entries(formState.errors).length > 0) {
      Object.entries(formState.errors).forEach((error) => {
        if (error[1] !== undefined) {
          return false;
        }
      });
    }
    return true;
  }

  return (
    <FormStyle onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="name" {...label('androidbuild')}>
          android build
        </label>
        <input
          className="form-control"
          {...text('androidbuild')}
          id="androidbuild"
          required
          type="number"
          aria-describedby="androidbuildHelp"
          placeholder="androidbuild"
          autoFocus
        />
      </div>
      <br />
      <div className="form-group">
        <label htmlFor="iosbuild" {...label('iosbuild')}>
          ios build
        </label>
        <input
          className="form-control"
          {...text('iosbuild')}
          id="iosbuild"
          required
          type="number"
          aria-describedby="iosbuildHelp"
          placeholder="iosbuild"
        />
      </div>
      <br />
      <div className="form-group">
      <label htmlFor="name" {...label('androidbuildforced')}>
          android build forced
        </label>
        <input
          className="form-control"
          {...text('androidbuildforced')}
          id="androidbuildforced"
          required
          type="number"
          aria-describedby="androidbuildforcedHelp"
          placeholder="androidbuildforced"
        />
      </div>
      <br />
      <div className="form-group">
        <label htmlFor="iosbuild" {...label('iosbuildforced')}>
          ios build forced
        </label>
        <input
          className="form-control"
          {...text('iosbuildforced')}
          id="iosbuildforced"
          required
          type="number"
          aria-describedby="iosbuildforcedHelp"
          placeholder="iosbuildforced"
        />
      </div>
      <button type="submit" className="btn btn-primary">
        Update
      </button>
      <br />
      <Link to={`/versions`}>Back to versions</Link>
    </FormStyle>
  );
});
