import React from 'react';
import { mount } from 'enzyme';
import injectFeatureToggles from './inject-feature-toggles';
import Configure from '../configure';
import memoryAdapter, { updateFlags } from '@flopflip/memory-adapter';

const FeatureComponent = () => <div />;
FeatureComponent.displayName = 'FeatureComponent';

const createTestProps = custom => ({
  adapterArgs: {},

  ...custom,
});

describe('without `propKey`', () => {
  const EnhancedComponent = injectFeatureToggles(['flag1', 'flag2'])(
    FeatureComponent
  );
  let props;
  let wrapper;

  describe('when feature is disabled', () => {
    beforeEach(() => {
      props = createTestProps({ defaultFlags: { flag1: false, flag2: false } });
      wrapper = mount(
        <Configure {...props} adapter={memoryAdapter}>
          <EnhancedComponent />
        </Configure>
      );
    });

    it('should match snapshot', () => {
      expect(wrapper).toMatchSnapshot();
    });

    it('should have feature disabling prop for `flag1`', () => {
      expect(wrapper.find(FeatureComponent)).toHaveProp(
        'featureToggles',
        expect.objectContaining({ flag1: false })
      );
    });

    it('should have feature disabling prop for `flag2`', () => {
      expect(wrapper.find(FeatureComponent)).toHaveProp(
        'featureToggles',
        expect.objectContaining({ flag2: false })
      );
    });

    describe('when enabling feature', () => {
      beforeEach(() => {
        updateFlags({ flag1: true });
        wrapper.update();
      });

      it('should match snapshot', () => {
        expect(wrapper).toMatchSnapshot();
      });

      it('should have feature enabling prop for `flag1`', () => {
        expect(wrapper.find(FeatureComponent)).toHaveProp(
          'featureToggles',
          expect.objectContaining({ flag1: true })
        );
      });
    });
  });
});

describe('with `propKey`', () => {
  const EnhancedComponent = injectFeatureToggles(['flag1'], 'fooBar')(
    FeatureComponent
  );
  let props;
  let wrapper;

  beforeEach(() => {
    props = createTestProps();
    wrapper = mount(
      <Configure {...props} adapter={memoryAdapter}>
        <EnhancedComponent />
      </Configure>
    );
  });

  it('should match snapshot', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('should have feature disabling `propKey`', () => {
    expect(wrapper.find(FeatureComponent)).toHaveProp('fooBar');
  });
});
