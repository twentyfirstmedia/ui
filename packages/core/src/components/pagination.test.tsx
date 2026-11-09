// @vitest-environment jsdom
/** Pagination: controlled with page + onChange, uncontrolled with defaultPage, page alone as before. */
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { useState } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { Pagination } from "./navigation.js";

afterEach(cleanup);

const current = () => screen.getByRole("button", { current: "page" }).textContent;

describe("Pagination", () => {
  it("is controlled with page and onChange", () => {
    const onChange = vi.fn();
    const { rerender } = render(<Pagination total={10} page={4} onChange={onChange} />);
    fireEvent.click(screen.getByRole("button", { name: "Next page" }));
    expect(onChange).toHaveBeenLastCalledWith(5);
    // the owner decides: still 4 until the prop changes
    expect(current()).toBe("4");
    rerender(<Pagination total={10} page={5} onChange={onChange} />);
    expect(current()).toBe("5");
    fireEvent.click(screen.getByRole("button", { name: "6" }));
    expect(onChange).toHaveBeenLastCalledWith(6);
  });

  it("follows the state of its owner", () => {
    function Owner() {
      const [page, setPage] = useState(1);
      return (
        <>
          <Pagination total={3} page={page} onChange={setPage} />
          <output>{page}</output>
        </>
      );
    }
    render(<Owner />);
    fireEvent.click(screen.getByRole("button", { name: "Next page" }));
    fireEvent.click(screen.getByRole("button", { name: "Next page" }));
    fireEvent.click(screen.getByRole("button", { name: "Next page" }));
    expect(screen.getByRole("status").textContent).toBe("3");
    expect(current()).toBe("3");
  });

  it("does not report the page it is already on or pages out of range", () => {
    const onChange = vi.fn();
    render(<Pagination total={3} defaultPage={1} onChange={onChange} />);
    fireEvent.click(screen.getByRole("button", { name: "Previous page" }));
    fireEvent.click(screen.getByRole("button", { name: "1" }));
    expect(onChange).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole("button", { name: "3" }));
    expect(onChange).toHaveBeenLastCalledWith(3);
    expect(current()).toBe("3");
  });

  it("page without onChange is the start page, as before", () => {
    render(<Pagination total={6} page={2} />);
    expect(current()).toBe("2");
    fireEvent.click(screen.getByRole("button", { name: "Next page" }));
    expect(current()).toBe("3");
  });
});
