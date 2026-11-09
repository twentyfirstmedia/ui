// @vitest-environment jsdom
/** FileDrop hands over the real files; progress shows only when someone reports it. */
import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { useState } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { FileDrop } from "./forms.js";
import type { UploadFile } from "./types.js";

afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

const pdf = () => new File(["%PDF"], "expose.pdf", { type: "application/pdf" });
const png = () => new File(["png"], "logo.png", { type: "image/png" });
const input = (c: HTMLElement) => c.querySelector('input[type="file"]') as HTMLInputElement;

describe("FileDrop", () => {
  it("onFiles receives the File objects; without files they are listed by size", () => {
    const onFiles = vi.fn();
    const onChange = vi.fn();
    const { container } = render(<FileDrop onFiles={onFiles} onChange={onChange} />);
    const file = pdf();
    fireEvent.change(input(container), { target: { files: [file] } });
    expect(onFiles).toHaveBeenCalledWith([file]);
    expect(onFiles.mock.calls[0]?.[0][0]).toBeInstanceOf(File);
    expect((onChange.mock.calls[0]?.[0] as UploadFile[])[0]?.file).toBe(file);
    // nothing made up: no progress bar, no "uploaded"
    expect(screen.queryByRole("progressbar")).toBeNull();
    expect(screen.getByText("expose.pdf")).toBeTruthy();
    expect(screen.queryByText(/uploaded/)).toBeNull();
    expect(screen.getByRole("button", { name: "Remove expose.pdf" })).toBeTruthy();
  });

  it("checks accept on drop, reports the rest and keeps one file when multiple is false", () => {
    const onFiles = vi.fn();
    const onReject = vi.fn();
    render(
      <FileDrop onFiles={onFiles} onReject={onReject} accept="image/*,.pdf" multiple={false} />,
    );
    const zip = new File(["zip"], "fotos.zip", { type: "application/zip" });
    const a = pdf(),
      b = png();
    fireEvent.drop(screen.getByRole("button", { name: /Drop files/ }), {
      dataTransfer: { files: [zip, a, b] },
    });
    expect(onReject).toHaveBeenCalledWith([zip]);
    expect(onFiles).toHaveBeenCalledWith([a]);
  });

  it("shows the progress the app reports", () => {
    function Upload() {
      const [files, setFiles] = useState<UploadFile[]>([]);
      return (
        <>
          <FileDrop
            files={files}
            onChange={setFiles}
            onFiles={() => {}}
            onRemove={(f) => removed(f.name)}
          />
          <button
            type="button"
            onClick={() => setFiles((l) => l.map((f) => ({ ...f, progress: 40 })))}
          >
            progress
          </button>
        </>
      );
    }
    const removed = vi.fn();
    const { container } = render(<Upload />);
    fireEvent.change(input(container), { target: { files: [pdf()] } });
    fireEvent.click(screen.getByText("progress"));
    const bar = screen.getByRole("progressbar", { name: "expose.pdf" });
    expect(bar.getAttribute("aria-valuenow")).toBe("40");
    fireEvent.click(screen.getByRole("button", { name: "Cancel upload" }));
    expect(removed).toHaveBeenCalledWith("expose.pdf");
    expect(screen.queryByText("expose.pdf")).toBeNull();
  });

  it("without onFiles it still simulates progress, as before", () => {
    vi.useFakeTimers();
    const { container } = render(<FileDrop />);
    fireEvent.change(input(container), { target: { files: [pdf()] } });
    expect(screen.getByRole("progressbar")).toBeTruthy();
    act(() => {
      vi.advanceTimersByTime(5000);
    });
    expect(screen.queryByRole("progressbar")).toBeNull();
    expect(screen.getByText(/uploaded/)).toBeTruthy();
  });
});
