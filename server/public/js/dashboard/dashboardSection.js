'use strict';

define(['react', 'jquery'], function (React, jQuery) {
    /**
     * A React component representing a section in the dashboard.
     */
    return React.createClass({
        displayName: 'DashboardSection',

        sectionTitleClicked: function (event) {
            var target = jQuery(event.target);
            var section = jQuery('#' + this.props.sectionID);

            if (target.hasClass('section-open')) {
                target.removeClass('section-open').addClass('section-closed');
                section.addClass('collapse');
            } else {
                target.removeClass('section-closed').addClass('section-open');
                section.removeClass('collapse');
            }
        },

        render: function () {
            return (
                React.createElement("div", {className: "dashboard-section"}, 
                    React.createElement("div", {className: "dashboard-section-title-wrapper"}, 
                        React.createElement("h2", {className: "dashboard-section-title section-open", 
                            onClick: this.sectionTitleClicked, 
                            "data-section": this.props.sectionID}, "Messages")
                    ), 
                    React.createElement("div", {className: "dashboard-section-content", 
                         id: this.props.sectionID}, 
                        this.props.sectionContent
                    )
                )
            );
        }
    });
});
