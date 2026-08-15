import Filter from "../../src/ui/filter";

describe("Filter", () => {
    const component = (
        <Filter.Root>
            <Filter.Select>
                <Filter.Title>Title</Filter.Title>
                <Filter.SelectLabel>All</Filter.SelectLabel>
            </Filter.Select>
            <Filter.Menu>
                <Filter.Option value="value1">Option 1</Filter.Option>
                <Filter.Option value="value2">Option 2</Filter.Option>
                <Filter.Option value="value3">Option 3</Filter.Option>
            </Filter.Menu>
        </Filter.Root>
    );

    it("deveria ser montado o componente", () => {
        cy.mount(component);
        cy.getDataTest("filter-root").should("have.length", 1).should("exist");
        cy.getDataTest("filter-select").should("have.length", 1).should("exist");
        cy.getDataTest("filter-title").should("have.length", 1).contains("Title");
        cy.getDataTest("filter-select-label").should("have.length", 1).contains("All");
        cy.getDataTest("filter-menu").should("not.exist");
        cy.getDataTest("filter-option").should("not.exist");
    });
});
