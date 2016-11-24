
import React from 'react';
// import ReactDOM from 'react-dom';
import Footer from './Footer'
import DatasetContainer from './dataset/DatasetContainer'
import ReactPlate from './plate/ReactPlate'


const App = React.createClass({

    parentTypes: ["dataset", "orphaned", "tag", "share", "plate", "acquisition"],

    getInitialState: function() {
        return {
            iconSize: 65,
        };
    },

    setIconSize: function(size) {
        this.setState({iconSize: size});
    },

    renderNothing: function(selected) {
        if (selected.length === 0) {
            if (this.previousParent) {
                return false;
            }
            return true;
        }
        var dtype = selected[0].type;
        if (dtype === "image") {
            return false;
        }
        if (selected.length > 1 && dtype !== "image") {
            return true;
        }
        if (this.parentTypes.indexOf(dtype) === -1) {
            return true;
        }
    },

    componentWillReceiveProps: function(nextProps) {
        // When props change...
        // If nothing is selected AND the previous node is valid
        // We continue to render that node (Dataset)
        if (nextProps.selected.length !== 0) {
            delete(this.previousParent);
        }
    },

    getParentNode: function() {
        var selected = this.props.selected,
            inst = this.props.jstree;
        if (this.renderNothing(selected)) {
            return;
        }
        if (selected.length === 0 && this.previousParent) {
            return this.previousParent;
        }
        var dtype = selected[0].type;
        if (this.parentTypes.indexOf(dtype) > -1) {
            return selected[0];
        }
        if (dtype === "image") {
            return inst.get_node(inst.get_parent(selected[0]));
        }
    },

    render: function() {
        // parentNode may be null if not suitable to display
        let parentNode = this.getParentNode();

        let childPanel;
        if (parentNode) {
            let dtype = parentNode.type;
            if (dtype === "plate" || dtype === "acquisition") {
                childPanel = (
                    <ReactPlate
                        parentNode={parentNode}
                        inst={this.props.jstree}
                        iconSize={this.state.iconSize} />
                )
            } else {
                // handles tag, orphaned, dataset, share
                // Cache this parentNode. If next selection == 0, still show this
                // E.g. if image in Dataset is de-selected
                this.previousParent = parentNode;
                childPanel = (
                    <DatasetContainer
                        parentNode={parentNode}
                        inst={this.props.jstree}
                        iconSize={this.state.iconSize} />
                )
            }
        }

        return (
            <div>
                
                {childPanel}
                <Footer
                    iconSize={this.state.iconSize}
                    setIconSize={this.setIconSize} />
            </div>
        );
    }
});


export default App